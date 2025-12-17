import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { runMigrations } from './db/migrate';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Security middleware
app.use(helmet());

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
    } catch (dbError: any) {
      console.warn('⚠️  Database connection failed:', dbError.message);
      console.warn('⚠️  Server will start without database connection');
      console.warn('⚠️  Please check DATABASE_URL and network connectivity');
    }

    // Start server on all network interfaces
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║      EventHub API Server              ║
║                                       ║
╠═══════════════════════════════════════╣
║  Status: Running                      ║
║  Port: ${PORT}                        ║
║  Environment: ${process.env.NODE_ENV || 'development'}           ║
║  Database: PostgreSQL (Drizzle ORM)   ║
║                                       ║
╚═══════════════════════════════════════╝
      `);
      console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
      console.log(`📡 API endpoint: http://0.0.0.0:${PORT}/api`);
      console.log(`💚 Health check: http://0.0.0.0:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
