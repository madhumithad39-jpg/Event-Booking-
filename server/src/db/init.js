import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query } from '../config/db.js';
import { seedData } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = async () => {
  try {
    console.log('[Database] Initializing database schema...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    // Execute schema statements
    await pool.query(schemaSql);
    console.log('[Database] Schema created / verified successfully.');

    // Seed default categories & sample events
    await seedData();
    console.log('[Database] Initialization completed successfully.');
  } catch (error) {
    console.error('[Database] Failed to initialize database:', error.message);
    throw error;
  }
};

// If run directly via `node src/db/init.js`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase()
    .then(() => {
      console.log('Database init script finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database init script error:', err);
      process.exit(1);
    });
}
