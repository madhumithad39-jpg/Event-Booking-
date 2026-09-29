import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';

import { auth } from './config/auth.js';
import { initializeDatabase } from './db/init.js';
import { startReminderJob } from './jobs/reminderJob.js';

import categoryRoutes from './routes/categoryRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. CORS Configuration
app.use(
  cors({
    origin: [
      CLIENT_URL,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

// 2. Mount Better Auth Handler BEFORE body parsers
// (Crucial: Better Auth processes the raw request stream)
app.all('/api/auth/*', toNodeHandler(auth));

// 3. Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'EVENTLY API',
    tagline: 'Discover. Book. Experience.',
    timestamp: new Date().toISOString(),
  });
});

// 5. REST Application Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// 6. Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// 7. Start Server & Bootstrap Database
const startServer = async () => {
  try {
    // Only attempt DB bootstrap if DATABASE_URL is set
    if (process.env.DATABASE_URL) {
      await initializeDatabase();
    } else {
      console.warn('[Server Warning] DATABASE_URL is not set. Database initialization skipped.');
    }

    // Start background scheduled reminder job
    startReminderJob();

    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 EVENTLY Server running on port ${PORT}`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🔒 Better Auth mounted at /api/auth/*`);
      console.log(`✉️  SMTP notifications active`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('[Server Startup Fatal Error]:', error);
    process.exit(1);
  }
};

startServer();

export default app;
