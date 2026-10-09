import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { globalRateLimiter, getClientIp } from "./lib/rate-limiter";
import {
  validateRequestMethod,
  validateRequestUrl,
  applyTrafficAndSecurityHeaders,
  handleHealthCheck,
} from "./lib/security";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

function renderRateLimitPage(resetInSeconds: number): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rate Limit Exceeded — Happy Events</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F8F5F0; color: #005B4F; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
    .card { background: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); max-width: 480px; border-top: 4px solid #C9A227; }
    h1 { font-size: 24px; margin-bottom: 12px; }
    p { color: #4A4A4A; font-size: 15px; line-height: 1.6; }
    .btn { display: inline-block; margin-top: 20px; padding: 10px 24px; background: #C9A227; color: #005B4F; font-weight: bold; border-radius: 8px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Too Many Requests</h1>
    <p>You have made too many requests in a short period. Please wait <strong>${resetInSeconds} seconds</strong> before refreshing the page.</p>
    <a href="/" class="btn" onclick="setTimeout(function(){ location.reload(); }, 1000); return false;">Try Again</a>
  </div>
</body>
</html>`;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    const urlStr = request.url;

    // 1. Method verification check
    if (!validateRequestMethod(request)) {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // 2. URL sanity & path traversal security check
    const urlCheck = validateRequestUrl(urlStr);
    if (!urlCheck.valid) {
      return new Response(`Bad Request: ${urlCheck.reason}`, { status: 400 });
    }

    const url = new URL(urlStr);
    const pathname = url.pathname;

    // 3. Health check endpoint for uptime monitors and load balancers
    if (pathname === "/health" || pathname === "/api/health") {
      return handleHealthCheck();
    }

    // 4. Rate Limiting Check (bypass for static assets and icons)
    const isStaticAsset =
      pathname.startsWith("/assets/") ||
      /\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2|woff|ttf|eot)$/i.test(pathname);

    if (!isStaticAsset) {
      const clientIp = getClientIp(request);
      const rateCheck = globalRateLimiter.check(clientIp, {
        windowMs: 60_000,
        maxRequests: 120, // 120 requests per minute per IP
      });

      if (!rateCheck.allowed) {
        return new Response(renderRateLimitPage(rateCheck.resetInSeconds), {
          status: 429,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Retry-After": String(rateCheck.resetInSeconds),
            "X-RateLimit-Limit": String(rateCheck.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateCheck.resetInSeconds),
          },
        });
      }
    }

    // 5. Delegate to SSR Handler
    try {
      const handler = await getServerEntry();
      const rawResponse = await handler.fetch(request, env, ctx);
      const normalizedResponse = await normalizeCatastrophicSsrResponse(rawResponse);

      // 6. Apply Security and Traffic Edge Caching Headers
      return applyTrafficAndSecurityHeaders(normalizedResponse, urlStr);
    } catch (error) {
      console.error("[SSR Error]", error);
      const errorResp = new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
      return applyTrafficAndSecurityHeaders(errorResp, urlStr);
    }
  },
};
