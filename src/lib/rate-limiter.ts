/**
 * In-memory token bucket / sliding window rate limiter
 * Protects against DDoS, scraping, and abusive traffic spikes.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  windowMs: number; // Window duration in ms (e.g. 60,000 for 1 min)
  maxRequests: number; // Max requests allowed per window
}

class RateLimiter {
  private records = new Map<string, RateLimitRecord>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Run cleanup every 2 minutes to prevent memory leaks from inactive IPs
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => this.cleanup(), 2 * 60 * 1000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  private cleanup() {
    const now = Date.now();
    for (const [ip, record] of this.records.entries()) {
      if (record.resetAt <= now) {
        this.records.delete(ip);
      }
    }
  }

  public check(
    ip: string,
    config: RateLimitConfig = { windowMs: 60_000, maxRequests: 120 },
  ): {
    allowed: boolean;
    remaining: number;
    resetInSeconds: number;
    limit: number;
  } {
    const now = Date.now();
    const record = this.records.get(ip);

    if (!record || record.resetAt <= now) {
      // First request or window expired: start new window
      this.records.set(ip, {
        count: 1,
        resetAt: now + config.windowMs,
      });

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetInSeconds: Math.ceil(config.windowMs / 1000),
        limit: config.maxRequests,
      };
    }

    // Existing active window
    record.count += 1;
    const remaining = Math.max(0, config.maxRequests - record.count);
    const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);

    if (record.count > config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetInSeconds,
        limit: config.maxRequests,
      };
    }

    return {
      allowed: true,
      remaining,
      resetInSeconds,
      limit: config.maxRequests,
    };
  }

  public reset(ip: string) {
    this.records.delete(ip);
  }
}

export const globalRateLimiter = new RateLimiter();

/**
 * Extracts client IP from standard proxy and CDN headers
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;

  // Cloudflare
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  // Standard X-Forwarded-For (take the first public IP)
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  // Nginx / general reverse proxy
  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  // True-Client-IP (Akamai, Cloudflare Enterprise)
  const trueClientIp = headers.get("true-client-ip");
  if (trueClientIp) return trueClientIp.trim();

  return "127.0.0.1";
}
