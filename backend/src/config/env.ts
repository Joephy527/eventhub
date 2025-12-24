import { z } from 'zod';
import logger from '../utils/logger';

const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('5000'),

  // Database Configuration
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),

  // JWT Configuration
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters for security'),
  JWT_EXPIRE: z.string().default('7d'),

  // CORS Configuration
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL').default('http://localhost:3000'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().positive()).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).pipe(z.number().positive()).default('100'),

  // Optional: Stripe Payment Configuration
  STRIPE_SECRET_KEY: z.string().optional(),

  // Optional: Google OAuth Configuration
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Optional: Sentry Error Tracking
  SENTRY_DSN: z.string().url().optional(),

  // Optional: Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env;

export function validateEnv(): Env {
  try {
    validatedEnv = envSchema.parse(process.env);

    logger.info('Environment variables validated successfully', {
      nodeEnv: validatedEnv.NODE_ENV,
      port: validatedEnv.PORT,
      stripeConfigured: !!validatedEnv.STRIPE_SECRET_KEY,
      googleOAuthConfigured: !!(validatedEnv.GOOGLE_CLIENT_ID && validatedEnv.GOOGLE_CLIENT_SECRET),
    });

    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('❌ Invalid environment variables:', {
        errors: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
          received: e.code === 'invalid_type' ? (e as any).received : undefined,
        })),
      });

      console.error('\n❌ Environment Validation Failed:\n');
      error.errors.forEach(err => {
        console.error(`  • ${err.path.join('.')}: ${err.message}`);
      });
      console.error('\nPlease check your .env file and fix the issues above.\n');

      process.exit(1);
    }

    throw error;
  }
}

export function getEnv(): Env {
  if (!validatedEnv) {
    throw new Error('Environment not validated. Call validateEnv() first.');
  }
  return validatedEnv;
}
