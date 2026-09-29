import { getMailerTransporter, getFromAddress } from '../config/mailer.js';
import {
  registrationOTPTemplate,
  bookingConfirmationTemplate,
  newEventNotificationTemplate,
  eventUpdateTemplate,
  tomorrowReminderTemplate,
  adminNewBookingTemplate,
} from './emailTemplates.js';

// Generic helper to send an email and log preview or success
const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = await getMailerTransporter();
    const from = getFromAddress();

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log(`[Email Service] Sent "${subject}" to ${to} (MessageId: ${info.messageId || 'mock'})`);
    return info;
  } catch (error) {
    console.error(`[Email Service Error] Failed sending "${subject}" to ${to}:`, error.message);
    // Don't crash main request if email fails, but log clearly
    return null;
  }
};

// EMAIL #1 — Registration OTP
export const sendRegistrationOTPEmail = async (email, otp) => {
  console.log(`[Email Service] Dispatched Registration OTP to ${email}: [${otp}]`);
  const { subject, html } = registrationOTPTemplate({ otp });
  return await sendMail({ to: email, subject, html });
};

// EMAIL #2 — Booking Confirmation
export const sendBookingConfirmationEmail = async (userEmail, bookingData) => {
  const { subject, html } = bookingConfirmationTemplate(bookingData);
  return await sendMail({ to: userEmail, subject, html });
};

// EMAIL #3 — New Event Notification
export const sendNewEventNotificationEmail = async (recipients, eventData) => {
  if (!recipients || recipients.length === 0) return;
  const { subject, html } = newEventNotificationTemplate(eventData);

  // Send to recipients individually or in batches to preserve privacy
  for (const email of recipients) {
    await sendMail({ to: email, subject, html });
  }
};

// EMAIL #4 — Event Update
export const sendEventUpdateEmail = async (recipients, updateData) => {
  if (!recipients || recipients.length === 0) return;
  const { subject, html } = eventUpdateTemplate(updateData);

  for (const email of recipients) {
    await sendMail({ to: email, subject, html });
  }
};

// EMAIL #5 — Tomorrow Event Reminder
export const sendTomorrowReminderEmail = async (userEmail, reminderData) => {
  const { subject, html } = tomorrowReminderTemplate(reminderData);
  return await sendMail({ to: userEmail, subject, html });
};

// EMAIL #6 — New Booking Admin Notification
export const sendAdminNewBookingEmail = async (bookingData) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@evently.com';
  const { subject, html } = adminNewBookingTemplate(bookingData);
  return await sendMail({ to: adminEmail, subject, html });
};

export default {
  sendRegistrationOTPEmail,
  sendBookingConfirmationEmail,
  sendNewEventNotificationEmail,
  sendEventUpdateEmail,
  sendTomorrowReminderEmail,
  sendAdminNewBookingEmail,
};
