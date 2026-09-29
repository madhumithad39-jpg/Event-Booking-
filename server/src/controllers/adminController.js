import { query } from '../config/db.js';
import { runTomorrowReminderJob } from '../jobs/reminderJob.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const [eventsCount, usersCount, bookingsCount, upcomingEventsCount, revenueResult] =
      await Promise.all([
        query('SELECT COUNT(*) FROM "events"'),
        query('SELECT COUNT(*) FROM "user"'),
        query('SELECT COUNT(*) FROM "bookings"'),
        query('SELECT COUNT(*) FROM "events" WHERE "date" >= CURRENT_DATE'),
        query('SELECT COALESCE(SUM("totalAmount"), 0) as "totalRevenue" FROM "bookings" WHERE "bookingStatus" = \'CONFIRMED\''),
      ]);

    res.json({
      success: true,
      stats: {
        totalEvents: parseInt(eventsCount.rows[0].count, 10),
        totalUsers: parseInt(usersCount.rows[0].count, 10),
        totalBookings: parseInt(bookingsCount.rows[0].count, 10),
        upcomingEvents: parseInt(upcomingEventsCount.rows[0].count, 10),
        totalRevenue: parseFloat(revenueResult.rows[0].totalRevenue),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        b."id",
        b."bookingId",
        b."ticketCount",
        b."totalAmount",
        b."bookingStatus",
        b."createdAt",
        b."reminderSent",
        u."name" as "userName",
        u."email" as "userEmail",
        e."id" as "eventId",
        e."title" as "eventName",
        e."date" as "eventDate",
        e."time" as "eventTime",
        e."venue" as "eventVenue"
      FROM "bookings" b
      JOIN "user" u ON b."userId" = u."id"
      JOIN "events" e ON b."eventId" = e."id"
      ORDER BY b."createdAt" DESC
    `);

    res.json({
      success: true,
      count: result.rowCount,
      bookings: result.rows.map((row) => ({
        ...row,
        formattedEventDate: new Date(row.eventDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        formattedBookingDate: new Date(row.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        "id",
        "name",
        "email",
        "role",
        "emailVerified",
        "createdAt"
      FROM "user"
      ORDER BY "createdAt" DESC
    `);

    res.json({
      success: true,
      count: result.rowCount,
      users: result.rows.map((user) => ({
        ...user,
        formattedJoinedDate: new Date(user.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const triggerReminders = async (req, res, next) => {
  try {
    const count = await runTomorrowReminderJob();
    res.json({
      success: true,
      message: `Tomorrow reminder job executed. Dispatched ${count} reminder emails.`,
      dispatchedCount: count,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAdminStats,
  getAllBookings,
  getAllUsers,
  triggerReminders,
};
