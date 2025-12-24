import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Request timing middleware
 * Logs request duration and warns on slow requests
 */
export function requestTiming(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    // Log all requests at info level
    logger.info('Request completed', logData);

    // Warn on slow requests (>1000ms)
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        ...logData,
        threshold: 1000,
      });
    }

    // Error on very slow requests (>5000ms)
    if (duration > 5000) {
      logger.error('Very slow request detected', {
        ...logData,
        threshold: 5000,
      });
    }
  });

  next();
}
