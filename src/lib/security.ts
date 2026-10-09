/**
 * Security and traffic optimization utilities for Happy Events
 */

const ALLOWED_METHODS = new Set(["GET", "HEAD", "POST", "OPTIONS"]);

export function validateRequestMethod(request: Request): boolean {
  return ALLOWED_METHODS.has(request.method.toUpperCase());
}

export function validateRequestUrl(urlStr: string): { valid: boolean; reason?: string } {
  try {
    const url = new URL(urlStr);
    const pathname = url.pathname;

    // Check for directory traversal attempts
    if (pathname.includes("..") || pathname.includes("//")) {
      return { valid: false, reason: "Invalid path structure" };
    }

    // Check for null bytes or forbidden characters
    if (pathname.includes("\0") || decodeURIComponent(url.search).includes("\0")) {
      return { valid: false, reason: "Null byte detected" };
    }

    // Check for XSS or command injection attempts in URL path
    if (/<script/i.test(pathname) || /javascript:/i.test(pathname)) {
      return { valid: false, reason: "Malicious payload detected" };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: "Malformed URL" };
  }
}

/**
 * Applies production-grade security and caching headers to every response
 */
export function applyTrafficAndSecurityHeaders(
  response: Response,
  urlStr: string,
): Response {
  const headers = new Headers(response.headers);

  // Security Headers
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );

  // Smart CDN and Browser Caching for high traffic resilience
  const isStaticAsset =
    /\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2|woff|ttf|eot)$/i.test(
      urlStr,
    );

  if (isStaticAsset) {
    // 1 year immutable cache for static assets and images
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (!headers.has("Cache-Control")) {
    // For HTML/SSR pages: allow edge CDNs to cache for 1 hour with stale-while-revalidate
    // to handle massive spikes without overwhelming the SSR server
    headers.set(
      "Cache-Control",
      "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    );
  }

  // Compression helper
  headers.set("Vary", "Accept-Encoding");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Health check endpoint for uptime monitors, Kubernetes, and load balancers
 */
export function handleHealthCheck(): Response {
  const healthData = {
    status: "ok",
    service: "Happy Events Web Application",
    uptime: typeof process !== "undefined" ? process.uptime() : 0,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(healthData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
