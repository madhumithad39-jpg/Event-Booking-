// Base template styling wrapper for consistent Evently branding
const wrapEmail = (title, contentHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0f19;
      color: #e2e8f0;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0b0f19;
      padding: 36px 0;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #131b2e;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .header {
      padding: 32px 32px 24px;
      background: linear-gradient(135deg, #1e1b4b 0%, #172554 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      text-align: center;
    }
    .brand-logo {
      display: inline-block;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #ffffff;
      text-decoration: none;
      text-transform: uppercase;
    }
    .brand-logo span {
      color: #818cf8;
    }
    .tagline {
      margin-top: 6px;
      font-size: 13px;
      color: #94a3b8;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 32px;
    }
    .footer {
      padding: 24px 32px;
      background-color: #0e1424;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      background-color: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
      margin-bottom: 16px;
    }
    .detail-card {
      background-color: #1a2238;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 14px;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #94a3b8;
    }
    .detail-val {
      color: #f8fafc;
      font-weight: 600;
      text-align: right;
    }
    .otp-box {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #818cf8;
      background-color: #1a2238;
      border: 2px dashed #6366f1;
      border-radius: 12px;
      padding: 18px 24px;
      text-align: center;
      margin: 24px 0;
    }
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      padding: 12px 28px;
      border-radius: 8px;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="#" class="brand-logo">EVENT<span>LY</span></a>
        <div class="tagline">Discover. Book. Experience.</div>
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} EVENTLY Inc. All rights reserved.</p>
        <p>This is an automated notification. Please do not reply directly to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

// EMAIL #1 — REGISTRATION OTP
export const registrationOTPTemplate = ({ otp }) => {
  const content = `
    <div style="text-align: center;">
      <div class="badge">Account Verification</div>
      <h2 style="color: #f8fafc; margin: 0 0 12px; font-size: 22px;">Verify Your Email Address</h2>
      <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
        Thank you for joining EVENTLY! Enter the One-Time Password (OTP) below to complete your registration and activate your account.
      </p>
      <div class="otp-box">${otp}</div>
      <p style="color: #cbd5e1; font-size: 13px; margin: 0 0 8px;">
        ⏱️ This OTP is valid for <strong>10 minutes</strong>.
      </p>
      <p style="color: #64748b; font-size: 12px; margin: 0;">
        If you did not request this registration, you can safely ignore this email.
      </p>
    </div>
  `;
  return {
    subject: `Your EVENTLY Verification Code: ${otp}`,
    html: wrapEmail('Verify Your Email - EVENTLY', content),
  };
};

// EMAIL #2 — BOOKING CONFIRMATION
export const bookingConfirmationTemplate = ({
  userName,
  eventName,
  date,
  time,
  venue,
  ticketCount,
  totalAmount,
  bookingId,
}) => {
  const content = `
    <div>
      <div class="badge" style="background-color: rgba(16, 185, 129, 0.15); color: #34d399; border-color: rgba(16, 185, 129, 0.3);">
        ✓ Booking Confirmed
      </div>
      <h2 style="color: #f8fafc; margin: 0 0 10px; font-size: 22px;">You're Going, ${userName}!</h2>
      <p style="color: #94a3b8; font-size: 15px; line-height: 1.5; margin: 0 0 20px;">
        Your tickets for <strong>${eventName}</strong> have been secured. Present your Booking ID at entry.
      </p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Booking ID</span>
          <span class="detail-val" style="color: #818cf8; font-family: monospace; font-size: 15px;">${bookingId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Event Name</span>
          <span class="detail-val">${eventName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date & Time</span>
          <span class="detail-val">${date} at ${time}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Venue</span>
          <span class="detail-val">${venue}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tickets</span>
          <span class="detail-val">${ticketCount} ${ticketCount > 1 ? 'tickets' : 'ticket'}</span>
        </div>
        <div class="detail-row" style="border-top: 1px solid rgba(255, 255, 255, 0.1); margin-top: 8px; padding-top: 12px;">
          <span class="detail-label" style="font-size: 15px; color: #f8fafc;">Total Paid</span>
          <span class="detail-val" style="font-size: 16px; color: #34d399;">$${parseFloat(totalAmount).toFixed(2)}</span>
        </div>
      </div>

      <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 24px;">
        You can view and manage your reservations anytime under <strong>My Bookings</strong> on EVENTLY.
      </p>
    </div>
  `;
  return {
    subject: `Booking Confirmed: ${eventName} [${bookingId}]`,
    html: wrapEmail('Booking Confirmed - EVENTLY', content),
  };
};

// EMAIL #3 — NEW EVENT NOTIFICATION
export const newEventNotificationTemplate = ({
  eventName,
  date,
  time,
  venue,
  category,
  description,
}) => {
  const content = `
    <div>
      <div class="badge">New Event Announced</div>
      <h2 style="color: #f8fafc; margin: 0 0 10px; font-size: 22px;">New Experience: ${eventName}</h2>
      <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
        A thrilling new event has just been published on EVENTLY in the <strong>${category}</strong> category. Check out the details below:
      </p>

      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Event</span>
          <span class="detail-val">${eventName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Category</span>
          <span class="detail-val">${category}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date & Time</span>
          <span class="detail-val">${date} at ${time}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Venue</span>
          <span class="detail-val">${venue}</span>
        </div>
      </div>

      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; background-color: #161f36; padding: 16px; border-radius: 8px; border-left: 3px solid #6366f1;">
        ${description}
      </p>

      <div style="text-align: center; margin-top: 24px;">
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">Tickets are now available on the platform.</p>
        <span style="display: inline-block; padding: 8px 16px; background-color: #6366f1; color: #ffffff; border-radius: 6px; font-weight: 600; font-size: 14px;">
          Explore on EVENTLY
        </span>
      </div>
    </div>
  `;
  return {
    subject: `New Event on EVENTLY: ${eventName}`,
    html: wrapEmail(`New Event: ${eventName} - EVENTLY`, content),
  };
};

// EMAIL #4 — EVENT UPDATE
export const eventUpdateTemplate = ({
  eventName,
  updatedFieldsText,
  date,
  time,
  venue,
  description,
}) => {
  const content = `
    <div>
      <div class="badge" style="background-color: rgba(245, 158, 11, 0.15); color: #fbbf24; border-color: rgba(245, 158, 11, 0.3);">
        ⚠️ Important Schedule Update
      </div>
      <h2 style="color: #f8fafc; margin: 0 0 10px; font-size: 22px;">Update for ${eventName}</h2>
      <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
        The event organizers have updated the details for an event you have booked tickets for.
      </p>

      ${
        updatedFieldsText
          ? `<div style="background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; color: #fde68a; font-size: 14px;">
              <strong>Changes Made:</strong> ${updatedFieldsText}
            </div>`
          : ''
      }

      <div class="detail-card">
        <h4 style="color: #f8fafc; margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Current Event Details</h4>
        <div class="detail-row">
          <span class="detail-label">Event</span>
          <span class="detail-val">${eventName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date & Time</span>
          <span class="detail-val" style="color: #fbbf24;">${date} at ${time}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Venue</span>
          <span class="detail-val" style="color: #fbbf24;">${venue}</span>
        </div>
      </div>

      <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
        Your existing tickets remain valid for the updated schedule. If you have any questions, please check your reservation in My Bookings.
      </p>
    </div>
  `;
  return {
    subject: `Update Notice: ${eventName}`,
    html: wrapEmail(`Update Notice: ${eventName} - EVENTLY`, content),
  };
};

// EMAIL #5 — TOMORROW EVENT REMINDER
export const tomorrowReminderTemplate = ({
  eventName,
  date,
  time,
  venue,
  ticketCount,
  bookingId,
}) => {
  const content = `
    <div>
      <div class="badge" style="background-color: rgba(14, 165, 233, 0.15); color: #38bdf8; border-color: rgba(14, 165, 233, 0.3);">
        🔔 Event Reminder
      </div>
      <h2 style="color: #f8fafc; margin: 0 0 10px; font-size: 22px;">Reminder: You have an event tomorrow!</h2>
      <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
        Get ready for an exciting experience! Your event <strong>${eventName}</strong> takes place tomorrow.
      </p>

      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Booking ID</span>
          <span class="detail-val" style="color: #38bdf8; font-family: monospace;">${bookingId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Event</span>
          <span class="detail-val">${eventName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date & Time</span>
          <span class="detail-val" style="color: #f8fafc; font-weight: 700;">${date} at ${time}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Venue</span>
          <span class="detail-val">${venue}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tickets</span>
          <span class="detail-val">${ticketCount} ${ticketCount > 1 ? 'tickets' : 'ticket'}</span>
        </div>
      </div>

      <div style="background-color: #162038; border-radius: 8px; padding: 14px; font-size: 13px; color: #94a3b8; text-align: center;">
        💡 <strong>Quick Tip:</strong> Please arrive 15-30 minutes early with your digital or printed Booking ID for seamless check-in.
      </div>
    </div>
  `;
  return {
    subject: `Reminder: You have an event tomorrow! [${eventName}]`,
    html: wrapEmail(`Reminder: ${eventName} Tomorrow - EVENTLY`, content),
  };
};

// EMAIL #6 — NEW BOOKING ADMIN NOTIFICATION
export const adminNewBookingTemplate = ({
  userName,
  userEmail,
  eventName,
  ticketCount,
  totalAmount,
  bookingId,
}) => {
  const content = `
    <div>
      <div class="badge" style="background-color: rgba(168, 85, 247, 0.15); color: #c084fc; border-color: rgba(168, 85, 247, 0.3);">
        Admin Notification
      </div>
      <h2 style="color: #f8fafc; margin: 0 0 10px; font-size: 22px;">New Ticket Booking Received</h2>
      <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
        A user has just booked tickets on EVENTLY. Here are the booking details:
      </p>

      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Booking ID</span>
          <span class="detail-val" style="color: #c084fc; font-family: monospace;">${bookingId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Attendee Name</span>
          <span class="detail-val">${userName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Attendee Email</span>
          <span class="detail-val">${userEmail}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Event</span>
          <span class="detail-val">${eventName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tickets Sold</span>
          <span class="detail-val">${ticketCount}</span>
        </div>
        <div class="detail-row" style="border-top: 1px solid rgba(255, 255, 255, 0.1); margin-top: 8px; padding-top: 12px;">
          <span class="detail-label" style="font-size: 15px; color: #f8fafc;">Total Revenue</span>
          <span class="detail-val" style="font-size: 16px; color: #34d399;">$${parseFloat(totalAmount).toFixed(2)}</span>
        </div>
      </div>

      <p style="color: #64748b; font-size: 12px; text-align: center;">
        View full booking records and event metrics in your EVENTLY Admin Dashboard.
      </p>
    </div>
  `;
  return {
    subject: `New Booking: ${eventName} by ${userName} [${bookingId}]`,
    html: wrapEmail(`New Booking - EVENTLY Admin`, content),
  };
};

export default {
  registrationOTPTemplate,
  bookingConfirmationTemplate,
  newEventNotificationTemplate,
  eventUpdateTemplate,
  tomorrowReminderTemplate,
  adminNewBookingTemplate,
};
