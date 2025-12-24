import express, { Request, Response } from 'express';
import { db } from '../db';
import { stripe } from '../services/paymentService';
import { users } from '../db/schema';
import logger from '../utils/logger';

const router = express.Router();

interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  services: {
    database: 'ok' | 'error';
    stripe: 'ok' | 'not_configured' | 'error';
  };
  version?: string;
}

router.get('/health', async (_req: Request, res: Response) => {
  const health: HealthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'error',
      stripe: 'not_configured',
    },
    version: process.env.npm_package_version || '1.0.0',
  };

  // Check database connection
  try {
    await db.select().from(users).limit(1);
    health.services.database = 'ok';
    logger.debug('Health check: Database OK');
  } catch (error: any) {
    health.services.database = 'error';
    health.status = 'degraded';
    logger.warn('Health check: Database connection failed', {
      error: error.message,
    });
  }

  // Check Stripe configuration
  if (stripe) {
    try {
      // Just verify we can create a client, don't actually make API call
      health.services.stripe = 'ok';
      logger.debug('Health check: Stripe OK');
    } catch (error: any) {
      health.services.stripe = 'error';
      health.status = 'degraded';
      logger.warn('Health check: Stripe error', {
        error: error.message,
      });
    }
  } else {
    health.services.stripe = 'not_configured';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Readiness probe (for Kubernetes/orchestrators)
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    // Check if database is accessible
    await db.select().from(users).limit(1);
    res.status(200).json({ ready: true });
  } catch (error) {
    logger.error('Readiness check failed', { error });
    res.status(503).json({ ready: false });
  }
});

// Liveness probe (for Kubernetes/orchestrators)
router.get('/live', (_req: Request, res: Response) => {
  // Simple liveness check - if the server responds, it's alive
  res.status(200).json({ alive: true });
});

export default router;
