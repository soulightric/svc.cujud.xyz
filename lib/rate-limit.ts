/**
 * Simple in-memory rate limiter (per-process).
 * Suitable for single-instance deployments. For multi-instance, use Redis.
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterSec: number;
}

/**
 * @param key   Unique key (e.g. `login:${ip}`)
 * @param limit Max requests in the window
 * @param windowMs Window length in ms
 */
export function rateLimit(
  key: string,
  limit = 10,
  windowMs = 15 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  cleanup(now);

  const entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfterSec: 0 };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: limit - entry.count,
    retryAfterSec: 0,
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
