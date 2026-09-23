import Redis from "ioredis";

const globalForRedis = globalThis as unknown as { redis?: Redis | null };

/**
 * Optional cache/queue connection. Returns null when REDIS_URL is not set so
 * the app keeps working without Redis during local development.
 */
export function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null;
  if (globalForRedis.redis === undefined) {
    globalForRedis.redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 2,
      lazyConnect: true,
    });
  }
  return globalForRedis.redis;
}
