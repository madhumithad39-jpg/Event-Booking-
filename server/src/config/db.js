import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL?.trim();
const isLocalhost = connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1');

// Safe pool configuration that avoids unhandled SASL SCRAM errors when DATABASE_URL is empty
const poolConfig = connectionString
  ? {
      connectionString,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000,
    }
  : {
      host: 'database-unconfigured.local',
      port: 5432,
      database: 'evently',
      user: 'unconfigured',
      password: 'unconfigured_password',
      connectionTimeoutMillis: 1000,
    };

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  if (!process.env.DATABASE_URL) {
    // Expected when DATABASE_URL is not set yet
    return;
  }
  console.error('[PostgreSQL] Idle client error:', err.message);
});

export const query = async (text, params) => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not configured in server/.env. Please add your Neon PostgreSQL connection string.'
    );
  }
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development' && duration > 500) {
      console.log(`[PostgreSQL Slow Query] ${duration}ms: ${text}`);
    }
    return res;
  } catch (error) {
    console.error(`[PostgreSQL Error] Query: ${text} | Message: ${error.message}`);
    throw error;
  }
};

export default {
  pool,
  query,
};
