# EVENTLY – Event Booking Platform

> **“Discover. Book. Experience.”**

EVENTLY is a clean, modern, and production-ready full-stack event booking platform. It connects audiences with live music concerts, tech conferences, developer hackathons, educational symposiums, creative workshops, and championship sports with real-time ticket availability, transactional email notifications, and automated reminder scheduling.

---

## 📸 Screenshots & Preview

> *Place application screenshots and UI walkthrough GIFs here before sharing.*

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EVENTLY HOME EXPERIENCE                         │
│  [Hero] "Discover Your Next Experience"                                │
│  [Search Bar] Live instant query                                       │
│  [Category Cards] Music • Tech • Education • Workshop • Sports • Arts  │
│  [Sections] Featured • Happening Soon • Popular Trending               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

### For Users
- **Browse & Search Events**: Filter by keywords, category, upcoming date filters (Today, Tomorrow, Weekend), and sort by date, price, or popularity.
- **Event Details**: High-resolution imagery, venue details, schedule, pricing, real-time ticket availability, and interactive stepper quantity selector.
- **Transactional Ticket Booking**: Atomic row-locked database booking that prevents race conditions, decrements available tickets, generates unique alphanumeric Booking IDs (e.g. `EVT-7K9M2P4X`), and dispatches instant email confirmations.
- **My Bookings Dashboard**: Clean digital ticket vouchers partitioned into Upcoming and Past events.
- **Email Verification via OTP**: Secure 6-digit OTP verification upon registration to ensure genuine email ownership.

### For Administrators
- **Executive Analytics Dashboard**: Real-time platform statistics (Total Events, Total Users, Total Bookings, Upcoming Events, Gross Revenue).
- **Event Management**: Create, edit, and delete events with automatic change detection.
- **Automated Booked Attendee Update Alerts**: If an admin updates an event's schedule, venue, date, time, or title, the platform detects the delta and automatically emails all booked attendees.
- **All Bookings Ledger**: Filterable table showing all platform bookings, attendee contacts, tickets, and revenue.
- **User Directory**: View all registered users, roles, and verification states.

### Email & Automation Workflows (SMTP / Nodemailer)
1. **EMAIL #1 — Registration OTP**: 6-digit verification code with 10-minute validity and branding.
2. **EMAIL #2 — Booking Confirmation**: Sent immediately after booking with Event details, Venue, Tickets, Price, and Booking ID.
3. **EMAIL #3 — New Event Notification**: Sent to verified registered users whenever an admin publishes a new event.
4. **EMAIL #4 — Event Update Notification**: Sent to booked attendees when an event's time, date, venue, or title changes.
5. **EMAIL #5 — Tomorrow Event Reminder**: Scheduled hourly job (`node-cron`) that automatically reminds attendees 24h prior to their event, tracking sent status in the database to prevent duplicate emails.
6. **EMAIL #6 — New Booking Admin Alert**: Alerts the platform administrator when tickets are booked.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, React Router v6, Axios, Lucide React, Better Auth Client SDK |
| **Styling** | Custom Vanilla CSS Design System with CSS Tokens, Glassmorphism, Responsive Grid |
| **Backend** | Node.js, Express.js (ES Modules), Better Auth Server (`better-auth`) |
| **Database** | PostgreSQL / Neon Serverless PostgreSQL (`pg` connection pool with SSL) |
| **Authentication** | Better Auth with Session Management, Email/Password, and `emailOTP` plugin |
| **Email System** | Nodemailer with SMTP transport (with development Ethereal fallback) |
| **Scheduling** | `node-cron` for automated event reminder checks |

---

## 📂 Project Structure

```
evently/
│
├── client/                              # React Vite Frontend
│   ├── src/
│   │   ├── components/                  # Navbar, Footer, EventCard, CategoryBadge, ProtectedRoute, AdminRoute
│   │   ├── context/                     # ToastContext & notification provider
│   │   ├── layouts/                     # MainLayout, AdminLayout
│   │   ├── pages/                       # HomePage, EventsPage, EventDetailsPage, BookingSuccessPage,
│   │   │                                # MyBookingsPage, LoginPage, RegisterPage, VerifyOtpPage
│   │   │   └── admin/                   # AdminDashboardPage, AdminEventsPage, AdminBookingsPage, AdminUsersPage
│   │   ├── services/                    # api.js (Axios), authClient.js (Better Auth)
│   │   ├── App.jsx                      # App route hierarchy
│   │   ├── main.jsx                     # Client entrypoint
│   │   └── index.css                    # Complete Evently Design System
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── server/                              # Express Node.js Backend
│   ├── src/
│   │   ├── config/                      # db.js (PostgreSQL pool), auth.js (Better Auth), mailer.js (Nodemailer)
│   │   ├── controllers/                 # eventController, bookingController, adminController, categoryController
│   │   ├── db/                          # schema.sql, init.js, seed.js (Categories, Demo Events)
│   │   ├── jobs/                        # reminderJob.js (Tomorrow reminder cron schedule)
│   │   ├── middleware/                  # authMiddleware (requireAuth, requireAdmin), errorHandler
│   │   ├── routes/                      # eventRoutes, bookingRoutes, adminRoutes, categoryRoutes
│   │   ├── services/                    # emailService.js, emailTemplates.js (6 HTML templates)
│   │   ├── utils/                       # idGenerator.js (unique booking code generator)
│   │   └── server.js                    # Express app, Better Auth handler, routes, and bootstrapper
│   ├── package.json
│   └── .env.example
│
├── .gitignore
├── package.json                         # Root orchestration scripts
└── README.md
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)

Create a `.env` file in the `server/` folder based on `server/.env.example`:

```env
PORT=5000
NODE_ENV=development

# Neon PostgreSQL Connection String (include sslmode=require)
DATABASE_URL=postgresql://username:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

# Better Auth Configuration
BETTER_AUTH_SECRET=your_32_character_long_secret_key_here_abcd1234efgh
BETTER_AUTH_URL=http://localhost:5000

# Client Application URL
CLIENT_URL=http://localhost:5173

# SMTP Email Configuration (Gmail, Brevo, SendGrid, Mailtrap, or Ethereal)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
SMTP_FROM="EVENTLY" <noreply@evently.com>

# Administrator Email (Receives booking notifications & assigned admin role)
ADMIN_EMAIL=admin@evently.com
```

> **Note:** If SMTP credentials are not set during local development, the backend automatically provisions a local test transport (Ethereal Email) and logs OTP codes and emails directly to the server terminal, ensuring zero interruption.

### Client (`client/.env`)

Create a `.env` file in the `client/` folder based on `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_BETTER_AUTH_URL=http://localhost:5000
```

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Neon PostgreSQL**: A free Neon account at [neon.tech](https://neon.tech)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/evently.git
cd evently
```

### 2. Install all dependencies
You can install dependencies for both frontend and backend using the root command:
```bash
npm run install:all
```
*Or manually:*
```bash
cd server && npm install
cd ../client && npm install
cd ..
```

### 3. Setup Neon Database & Run Seed
1. Create a free project on [neon.tech](https://neon.tech) and copy your connection string.
2. Paste it into `server/.env` under `DATABASE_URL`.
3. Initialize the database schema and seed demo events & categories:
```bash
npm run init:db
```
*(The server also runs this automatically on startup if the tables do not exist).*

### 4. Run the Development Servers
In separate terminal tabs:

**Start Backend Server (Port 5000):**
```bash
npm run dev:server
```

**Start Frontend Client (Port 5173):**
```bash
npm run dev:client
```

Open `http://localhost:5173` in your browser.

---

## 🛡️ Admin Setup & Role Assignment

1. Set `ADMIN_EMAIL=your_admin_email@example.com` in `server/.env`.
2. Register an account with that email address on `/register`.
3. Verify your email with the 6-digit OTP received in your inbox (or terminal console in dev mode).
4. Upon sign-in, the account is automatically recognized with the `admin` role, unlocking the **Admin Dashboard** button in the navigation header.

---

## 📡 REST API Reference

### Authentication (Better Auth)
- `POST /api/auth/sign-up/email` — Register new user
- `POST /api/auth/sign-in/email` — Sign in with credentials
- `POST /api/auth/sign-out` — End session
- `GET /api/auth/get-session` — Retrieve authenticated user session
- `POST /api/auth/email-otp/send-verification-otp` — Request 6-digit verification code
- `POST /api/auth/email-otp/verify-email` — Verify email OTP

### Events
- `GET /api/events` — List events (supports `search`, `category`, `dateFilter`, `sort`, `featured`)
- `GET /api/events/:id` — Get single event by ID
- `POST /api/events` — Create event *(Admin only; dispatches Email #3)*
- `PUT /api/events/:id` — Update event *(Admin only; change-detection dispatches Email #4 to booked users)*
- `DELETE /api/events/:id` — Delete event *(Admin only)*

### Categories
- `GET /api/categories` — List available event categories

### Bookings
- `POST /api/bookings` — Book tickets with row-level locking *(Authenticated; dispatches Email #2 & #6)*
- `GET /api/bookings/my` — Get authenticated user's reservations (upcoming & past)
- `GET /api/bookings/:id` — View specific booking confirmation voucher

### Admin
- `GET /api/admin/stats` — Platform metrics (Total Events, Users, Bookings, Revenue)
- `GET /api/admin/bookings` — Full platform booking ledger
- `GET /api/admin/users` — Registered users and role status
- `POST /api/admin/trigger-reminders` — Manually execute the tomorrow reminder cron job

---

## 🔮 Future Improvements
- QR code generation on ticket vouchers for mobile gate check-in.
- Integration with calendar links (Google Calendar, iCal, Outlook).
- Multiple ticket tiers (e.g. VIP, General Admission, Early Bird).
- Seat map selector for arena venues.

---

## 📄 License
This project is licensed under the MIT License.
