type RetryOptions = {
  retries?: number;
  delayMs?: number;
  backoffFactor?: number;
  shouldRetry?: (error: any) => boolean;
};

const transientErrorCodes = new Set([
  'ETIMEDOUT',
  'ECONNRESET',
  'ECONNREFUSED',
  'EAI_AGAIN',
  'ECONNABORTED',
  // Postgres serialization/deadlock
  '40001',
  '40P01',
]);

const stripeTransientTypes = new Set([
  'StripeAPIError',
  'StripeConnectionError',
  'StripeRateLimitError',
]);

export function isTransientError(error: any): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const code = (error as any).code;
  if (code && transientErrorCodes.has(String(code))) {
    return true;
  }

  const type = (error as any).type;
  if (type && stripeTransientTypes.has(String(type))) {
    return true;
  }

  const statusCode = (error as any).statusCode ?? (error as any).status;
  if (statusCode && [429, 500, 502, 503, 504].includes(Number(statusCode))) {
    return true;
  }

  return false;
}

function sleep(durationMs: number) {
  return new Promise(resolve => setTimeout(resolve, durationMs));
}

export async function retryAsync<T>(
  operation: () => Promise<T>,
  {
    retries = 2,
    delayMs = 200,
    backoffFactor = 2,
    shouldRetry = isTransientError,
  }: RetryOptions = {}
): Promise<T> {
  let attempt = 0;
  let delay = delayMs;
  let lastError: any;

  while (attempt <= retries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === retries || !shouldRetry(error)) {
        throw error;
      }
      await sleep(delay);
      delay *= backoffFactor;
      attempt++;
    }
  }

  throw lastError;
}
