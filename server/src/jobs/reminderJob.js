import cron from 'node-cron';
import { query } from '../config/db.js';
import { sendTomorrowReminderEmail } from '../services/emailService.js';

export const runTomorrowReminderJob = async () => {
  console.log('[Reminder Cron] Checking for events occurring tomorrow with unsent booking reminders...');

  try {
    // Find all confirmed bookings for events taking place tomorrow that haven't received a reminder yet
    const result = await query(`
      SELECT 
        b."id" as "bookingDbId",
        b."bookingId",
        b."ticketCount",
        u."email" as "userEmail",
        u."name" as "userName",
        e."title" as "eventName",
        e."date" as "eventDate",
        e."time" as "eventTime",
        e."venue" as "eventVenue"
      FROM "bookings" b
      JOIN "events" e ON b."eventId" = e."id"
      JOIN "user" u ON b."userId" = u."id"
      WHERE 
        e."date" = (CURRENT_DATE + INTERVAL '1 day')
        AND b."reminderSent" = false
        AND b."bookingStatus" = 'CONFIRMED'
    `);

    if (result.rowCount === 0) {
      console.log('[Reminder Cron] No pending tomorrow reminders found.');
      return 0;
    }

    console.log(`[Reminder Cron] Found ${result.rowCount} bookings requiring reminder dispatch.`);

    let sentCount = 0;
    for (const row of result.rows) {
      const formattedDate = new Date(row.eventDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      await sendTomorrowReminderEmail(row.userEmail, {
        eventName: row.eventName,
        date: formattedDate,
        time: row.eventTime,
        venue: row.eventVenue,
        ticketCount: row.ticketCount,
        bookingId: row.bookingId,
      });

      // Mark reminder as sent atomically to prevent duplicate emails
      await query(`UPDATE "bookings" SET "reminderSent" = true WHERE "id" = $1`, [
        row.bookingDbId,
      ]);

      sentCount++;
    }

    console.log(`[Reminder Cron] Successfully dispatched ${sentCount} tomorrow reminder emails.`);
    return sentCount;
  } catch (error) {
    console.error('[Reminder Cron Error]:', error.message);
    return 0;
  }
};

export const startReminderJob = () => {
  // Schedule to run every hour at minute 0
  cron.schedule('0 * * * *', () => {
    runTomorrowReminderJob();
  });

  console.log('[Reminder Cron] Scheduled tomorrow reminder job (hourly).');
};

export default {
  runTomorrowReminderJob,
  startReminderJob,
};
