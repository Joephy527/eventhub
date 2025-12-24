import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { runMigrations } from './db/migrate';
import { stripe } from './services/paymentService';
import logger from './utils/logger';
import { requestTiming } from './middleware/requestTiming';
import { validateEnv } from './config/env';

// Load environment variables first
dotenv.config();

// Validate environment variables before starting server
validateEnv();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Security middleware
app.use(helmet());

// Request timing middleware (before routes)
app.use(requestTiming);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    // Run migrations (optional - will continue if fails)
    try {
      await runMigrations();
      logger.info('Database migrations completed successfully');
    } catch (dbError: any) {
      logger.warn('Database connection failed', {
        error: dbError.message,
        stack: dbError.stack,
      });
      logger.warn('Server will start without database connection');
      logger.warn('Please check DATABASE_URL and network connectivity');
    }

    // Start server on all network interfaces
    app.listen(PORT, '0.0.0.0', () => {
      const paymentStatus = stripe ? '✓ Enabled' : '✗ Disabled';

      logger.info(`
╔═══════════════════════════════════════╗
║                                       ║
║      EventHub API Server              ║
║                                       ║
╠═══════════════════════════════════════╣
║  Status: Running                      ║
║  Port: ${PORT}                        ║
║  Environment: ${process.env.NODE_ENV || 'development'}           ║
║  Database: PostgreSQL (Drizzle ORM)   ║
║  Payments: ${paymentStatus}                      ║
║                                       ║
╚═══════════════════════════════════════╝
      `);
      logger.info(`Server is running on http://0.0.0.0:${PORT}`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        paymentsEnabled: !!stripe,
      });
      logger.info(`API endpoint: http://0.0.0.0:${PORT}/api`);
      logger.info(`Health check: http://0.0.0.0:${PORT}/api/health`);

      if (!stripe) {
        logger.warn('Payment features are disabled. Set STRIPE_SECRET_KEY to enable payments.');
      }
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

startServer();

export default app;
