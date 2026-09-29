import { pool } from '../config/db.js';
import { generateBookingId } from '../utils/idGenerator.js';
import {
  sendBookingConfirmationEmail,
  sendAdminNewBookingEmail,
} from '../services/emailService.js';

export const createBooking = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { eventId, ticketCount } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;
    const userEmail = req.user.email;

    // Validate inputs
    const parsedTicketCount = parseInt(ticketCount, 10);
    if (isNaN(parsedTicketCount) || parsedTicketCount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket count. Please select at least 1 ticket.',
      });
    }

    if (parsedTicketCount > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 tickets allowed per booking.',
      });
    }

    // Begin PostgreSQL Transaction with row locking
    await client.query('BEGIN');

    // Lock event row to prevent race conditions on ticket counts
    const eventResult = await client.query(
      `SELECT * FROM "events" WHERE "id" = $1 FOR UPDATE`,
      [eventId]
    );

    if (eventResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    const event = eventResult.rows[0];

    // Check if event is upcoming
    const today = new Date().toISOString().split('T')[0];
    const eventDate = new Date(event.date).toISOString().split('T')[0];
    if (eventDate < today) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Cannot book tickets for past events.',
      });
    }

    // Check ticket availability
    if (event.availableTickets < parsedTicketCount) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message:
          event.availableTickets === 0
            ? 'Event is completely sold out.'
            : `Only ${event.availableTickets} tickets remaining.`,
      });
    }

    // Calculate total amount
    const unitPrice = parseFloat(event.price);
    const totalAmount = (unitPrice * parsedTicketCount).toFixed(2);

    // Generate unique booking code
    let bookingId = generateBookingId();
    // Ensure uniqueness
    let isUnique = false;
    while (!isUnique) {
      const checkId = await client.query(
        'SELECT 1 FROM "bookings" WHERE "bookingId" = $1',
        [bookingId]
      );
      if (checkId.rowCount === 0) {
        isUnique = true;
      } else {
        bookingId = generateBookingId();
      }
    }

    // Decrement available tickets
    await client.query(
      `UPDATE "events" 
       SET "availableTickets" = "availableTickets" - $1, "updatedAt" = NOW()
       WHERE "id" = $2`,
      [parsedTicketCount, eventId]
    );

    // Insert booking record
    const bookingResult = await client.query(
      `INSERT INTO "bookings" 
       ("userId", "eventId", "ticketCount", "totalAmount", "bookingStatus", "bookingId", "createdAt")
       VALUES ($1, $2, $3, $4, 'CONFIRMED', $5, NOW())
       RETURNING *`,
      [userId, eventId, parsedTicketCount, totalAmount, bookingId]
    );

    await client.query('COMMIT');

    const booking = bookingResult.rows[0];

    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const bookingDetails = {
      bookingId: booking.bookingId,
      userName,
      userEmail,
      eventName: event.title,
      date: formattedDate,
      time: event.time,
      venue: event.venue,
      ticketCount: booking.ticketCount,
      totalAmount: booking.totalAmount,
      bookingStatus: booking.bookingStatus,
      createdAt: booking.createdAt,
    };

    // Asynchronously dispatch EMAIL #2 (Confirmation to User) and EMAIL #6 (Admin notification)
    (async () => {
      try {
        await sendBookingConfirmationEmail(userEmail, bookingDetails);
      } catch (err) {
        console.error('[Email Notification Error - Booking Confirmation]:', err.message);
      }

      try {
        await sendAdminNewBookingEmail(bookingDetails);
      } catch (err) {
        console.error('[Email Notification Error - Admin New Booking]:', err.message);
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully!',
      booking: bookingDetails,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
         b."id",
         b."bookingId",
         b."ticketCount",
         b."totalAmount",
         b."bookingStatus",
         b."createdAt",
         e."id" as "eventId",
         e."title",
         e."description",
         e."category",
         e."date",
         e."time",
         e."venue",
         e."image",
         e."price"
       FROM "bookings" b
       JOIN "events" e ON b."eventId" = e."id"
       WHERE b."userId" = $1
       ORDER BY e."date" ASC, e."time" ASC`,
      [userId]
    );

    const today = new Date().toISOString().split('T')[0];

    const upcoming = [];
    const past = [];

    result.rows.forEach((booking) => {
      const eventDate = new Date(booking.date).toISOString().split('T')[0];
      const formattedBooking = {
        ...booking,
        formattedDate: new Date(booking.date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      if (eventDate >= today) {
        upcoming.push(formattedBooking);
      } else {
        past.push(formattedBooking);
      }
    });

    res.json({
      success: true,
      upcoming,
      past,
      totalCount: result.rowCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params; // can be bookingId (e.g. EVT-...) or integer id
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let sql = `
      SELECT 
        b."id",
        b."bookingId",
        b."ticketCount",
        b."totalAmount",
        b."bookingStatus",
        b."createdAt",
        b."userId",
        u."name" as "userName",
        u."email" as "userEmail",
        e."id" as "eventId",
        e."title" as "eventName",
        e."category",
        e."date",
        e."time",
        e."venue",
        e."image"
      FROM "bookings" b
      JOIN "events" e ON b."eventId" = e."id"
      JOIN "user" u ON b."userId" = u."id"
      WHERE (b."bookingId" = $1 OR b."id"::text = $1)
    `;

    const result = await pool.query(sql, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    const booking = result.rows[0];

    // Authorize owner or admin
    if (!isAdmin && booking.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own bookings.',
      });
    }

    const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    res.json({
      success: true,
      booking: {
        ...booking,
        formattedDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createBooking,
  getMyBookings,
  getBookingById,
};
