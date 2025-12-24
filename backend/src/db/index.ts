import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import logger from '../utils/logger';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

logger.info('Initializing database connection pool...');

// PostgreSQL connection with connection pooling
const client = postgres(connectionString, {
  prepare: false, // Disable prepared statements for better compatibility
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Timeout for new connections (seconds)
  max_lifetime: 60 * 30, // Maximum lifetime of a connection (30 minutes)
  onnotice: () => {}, // Suppress notices
});

logger.info('Database connection pool configured', {
  maxConnections: 10,
  idleTimeout: 20,
  connectTimeout: 10,
});

export const db = drizzle(client, { schema });

export type DbClient = typeof db;
export type DbTransaction = Parameters<DbClient['transaction']>[0] extends (
  tx: infer T,
  ...args: any[]
) => any
  ? T
  : never;
