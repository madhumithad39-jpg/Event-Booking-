-- ===================================================
-- EVENTLY Database Schema (PostgreSQL / Neon compatible)
-- ===================================================

-- 1. Better Auth Tables
CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  "image" TEXT,
  "role" VARCHAR(20) NOT NULL DEFAULT 'user',
  "banned" BOOLEAN DEFAULT FALSE,
  "banReason" TEXT,
  "banExpires" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT PRIMARY KEY,
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
  "refreshTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Application Tables

CREATE TABLE IF NOT EXISTS "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL UNIQUE,
  "icon" VARCHAR(50),
  "description" TEXT
);

CREATE TABLE IF NOT EXISTS "events" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL,
  "category" VARCHAR(100) NOT NULL,
  "date" DATE NOT NULL,
  "time" VARCHAR(20) NOT NULL,
  "venue" VARCHAR(255) NOT NULL,
  "price" NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  "totalTickets" INT NOT NULL CHECK ("totalTickets" >= 0),
  "availableTickets" INT NOT NULL CHECK ("availableTickets" >= 0),
  "image" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "createdBy" TEXT REFERENCES "user"("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "bookings" (
  "id" SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "eventId" INT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "ticketCount" INT NOT NULL CHECK ("ticketCount" > 0),
  "totalAmount" NUMERIC(10, 2) NOT NULL CHECK ("totalAmount" >= 0),
  "bookingStatus" VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
  "bookingId" VARCHAR(50) NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "reminderSent" BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS "idx_events_category" ON "events"("category");
CREATE INDEX IF NOT EXISTS "idx_events_date" ON "events"("date");
CREATE INDEX IF NOT EXISTS "idx_bookings_user" ON "bookings"("userId");
CREATE INDEX IF NOT EXISTS "idx_bookings_event" ON "bookings"("eventId");
CREATE INDEX IF NOT EXISTS "idx_bookings_reminder" ON "bookings"("reminderSent", "bookingStatus");
