import { query } from '../config/db.js';
import {
  sendNewEventNotificationEmail,
  sendEventUpdateEmail,
} from '../services/emailService.js';

export const getEvents = async (req, res, next) => {
  try {
    const {
      search,
      category,
      dateFilter,
      sort = 'date-asc',
      limit,
      offset = 0,
      featured,
    } = req.query;

    const conditions = [];
    const params = [];

    // Search by title, description, or venue
    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      conditions.push(
        `("title" ILIKE $${params.length} OR "description" ILIKE $${params.length} OR "venue" ILIKE $${params.length})`
      );
    }

    // Filter by category
    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      params.push(category.trim());
      conditions.push(`LOWER("category") = LOWER($${params.length})`);
    }

    // Filter by date
    if (dateFilter) {
      if (dateFilter === 'today') {
        conditions.push(`"date" = CURRENT_DATE`);
      } else if (dateFilter === 'tomorrow') {
        conditions.push(`"date" = CURRENT_DATE + INTERVAL '1 day'`);
      } else if (dateFilter === 'this-weekend') {
        // Events on next Friday, Saturday, or Sunday
        conditions.push(
          `"date" >= CURRENT_DATE AND "date" <= (CURRENT_DATE + ((7 - EXTRACT(DOW FROM CURRENT_DATE)::int) % 7)::int)`
        );
      } else if (dateFilter === 'upcoming') {
        conditions.push(`"date" >= CURRENT_DATE`);
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
        params.push(dateFilter);
        conditions.push(`"date" = $${params.length}`);
      }
    }

    // Determine sorting
    let orderByClause = 'ORDER BY "date" ASC, "time" ASC';
    if (sort === 'date-desc') {
      orderByClause = 'ORDER BY "date" DESC, "time" DESC';
    } else if (sort === 'price-asc') {
      orderByClause = 'ORDER BY "price" ASC';
    } else if (sort === 'price-desc') {
      orderByClause = 'ORDER BY "price" DESC';
    } else if (sort === 'popular') {
      orderByClause = 'ORDER BY ("totalTickets" - "availableTickets") DESC';
    }

    let sql = `SELECT * FROM "events"`;
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    sql += ` ${orderByClause}`;

    if (featured === 'true') {
      sql += ` LIMIT 4`;
    } else if (limit) {
      params.push(parseInt(limit, 10));
      sql += ` LIMIT $${params.length}`;
      if (offset) {
        params.push(parseInt(offset, 10));
        sql += ` OFFSET $${params.length}`;
      }
    }

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rowCount,
      events: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM "events" WHERE "id" = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    res.json({
      success: true,
      event: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      price = 0,
      totalTickets,
      image,
    } = req.body;

    // Validation
    if (!title || !description || !category || !date || !time || !venue || !totalTickets || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, date, time, venue, totalTickets, image.',
      });
    }

    const parsedTotalTickets = parseInt(totalTickets, 10);
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedTotalTickets) || parsedTotalTickets <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Total tickets must be a positive number.',
      });
    }

    const createdBy = req.user?.id || null;

    const result = await query(
      `INSERT INTO "events" 
       ("title", "description", "category", "date", "time", "venue", "price", "totalTickets", "availableTickets", "image", "createdBy")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        title.trim(),
        description.trim(),
        category.trim(),
        date,
        time.trim(),
        venue.trim(),
        parsedPrice,
        parsedTotalTickets,
        parsedTotalTickets, // initial available = total
        image.trim(),
        createdBy,
      ]
    );

    const newEvent = result.rows[0];

    // Asynchronously dispatch EMAIL #3: New Event Notification to all verified users
    (async () => {
      try {
        const usersResult = await query(
          `SELECT "email" FROM "user" WHERE "emailVerified" = true`
        );
        const recipientEmails = usersResult.rows.map((u) => u.email).filter(Boolean);

        if (recipientEmails.length > 0) {
          const formattedDate = new Date(newEvent.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          await sendNewEventNotificationEmail(recipientEmails, {
            eventName: newEvent.title,
            date: formattedDate,
            time: newEvent.time,
            venue: newEvent.venue,
            category: newEvent.category,
            description: newEvent.description,
          });
        }
      } catch (emailErr) {
        console.error('[Email Notification Error - New Event]:', emailErr.message);
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      event: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      price,
      totalTickets,
      image,
    } = req.body;

    const existingResult = await query('SELECT * FROM "events" WHERE "id" = $1', [id]);
    if (existingResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    const currentEvent = existingResult.rows[0];

    // Detect meaningful changes: date, time, venue, title, description, category
    const changedFields = [];

    const formatCurrentDate = new Date(currentEvent.date).toISOString().split('T')[0];
    const incomingDate = date ? new Date(date).toISOString().split('T')[0] : formatCurrentDate;

    if (title && title.trim() !== currentEvent.title) {
      changedFields.push(`Title updated to "${title.trim()}"`);
    }
    if (category && category.trim() !== currentEvent.category) {
      changedFields.push(`Category changed to "${category.trim()}"`);
    }
    if (date && incomingDate !== formatCurrentDate) {
      changedFields.push(`Date changed from ${formatCurrentDate} to ${incomingDate}`);
    }
    if (time && time.trim() !== currentEvent.time) {
      changedFields.push(`Time changed from ${currentEvent.time} to ${time.trim()}`);
    }
    if (venue && venue.trim() !== currentEvent.venue) {
      changedFields.push(`Venue relocated from "${currentEvent.venue}" to "${venue.trim()}"`);
    }
    if (description && description.trim() !== currentEvent.description) {
      changedFields.push(`Event schedule/description updated`);
    }

    // Handle ticket count adjustment
    let newTotal = currentEvent.totalTickets;
    let newAvailable = currentEvent.availableTickets;

    if (totalTickets !== undefined) {
      const parsedTotal = parseInt(totalTickets, 10);
      if (!isNaN(parsedTotal) && parsedTotal >= 0) {
        const soldTickets = currentEvent.totalTickets - currentEvent.availableTickets;
        if (parsedTotal < soldTickets) {
          return res.status(400).json({
            success: false,
            message: `Cannot reduce total tickets below already booked count (${soldTickets}).`,
          });
        }
        newTotal = parsedTotal;
        newAvailable = parsedTotal - soldTickets;
      }
    }

    const updatedResult = await query(
      `UPDATE "events"
       SET "title" = COALESCE($1, "title"),
           "description" = COALESCE($2, "description"),
           "category" = COALESCE($3, "category"),
           "date" = COALESCE($4, "date"),
           "time" = COALESCE($5, "time"),
           "venue" = COALESCE($6, "venue"),
           "price" = COALESCE($7, "price"),
           "totalTickets" = $8,
           "availableTickets" = $9,
           "image" = COALESCE($10, "image"),
           "updatedAt" = NOW()
       WHERE "id" = $11
       RETURNING *`,
      [
        title ? title.trim() : null,
        description ? description.trim() : null,
        category ? category.trim() : null,
        date || null,
        time ? time.trim() : null,
        venue ? venue.trim() : null,
        price !== undefined ? parseFloat(price) : null,
        newTotal,
        newAvailable,
        image ? image.trim() : null,
        id,
      ]
    );

    const updatedEvent = updatedResult.rows[0];

    // If meaningful changes occurred, trigger EMAIL #4 to users who booked this event
    if (changedFields.length > 0) {
      (async () => {
        try {
          const bookedUsersResult = await query(
            `SELECT DISTINCT u."email", u."name"
             FROM "bookings" b
             JOIN "user" u ON b."userId" = u."id"
             WHERE b."eventId" = $1 AND b."bookingStatus" = 'CONFIRMED'`,
            [id]
          );

          const recipientEmails = bookedUsersResult.rows.map((u) => u.email).filter(Boolean);

          if (recipientEmails.length > 0) {
            const formattedDate = new Date(updatedEvent.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            await sendEventUpdateEmail(recipientEmails, {
              eventName: updatedEvent.title,
              updatedFieldsText: changedFields.join('; '),
              date: formattedDate,
              time: updatedEvent.time,
              venue: updatedEvent.venue,
              description: updatedEvent.description,
            });
            console.log(`[Email Service] Dispatched event update notification to ${recipientEmails.length} booked attendees.`);
          }
        } catch (emailErr) {
          console.error('[Email Notification Error - Event Update]:', emailErr.message);
        }
      })();
    }

    res.json({
      success: true,
      message: 'Event updated successfully.',
      event: updatedEvent,
      meaningfulChangesDetected: changedFields.length > 0,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const checkResult = await query('SELECT * FROM "events" WHERE "id" = $1', [id]);
    if (checkResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    await query('DELETE FROM "events" WHERE "id" = $1', [id]);

    res.json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
