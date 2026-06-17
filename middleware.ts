import { NextRequest, NextResponse } from "next/server";

/* ═══════════════════════════════════════════════════════
   RATE LIMITER — in-memory (działa na Edge Runtime)
═══════════════════════════════════════════════════════ */

interface RateLimitEntry {
  count:     number;
  resetTime: number;
}

const rateMap = new Map<string, RateLimitEntry>();

const RATE_LIMIT = {
  windowMs: 60_000, // 1 minuta
  maxReqs:  60,     // max 60 requestów / minutę per IP
  apiMax:   10,     // max 10 requestów / minutę na /api
};

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(key: string, max: number): boolean {
  const now   = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateMap.set(key, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return false;
  }

  if (entry.count >= max) return true;

  entry.count++;
  return false;
}

/* ═══════════════════════════════════════════════════════
   BOT / SUSPICIOUS UA DETECTION
═══════════════════════════════════════════════════════ */

const BLOCKED_UA_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
  /zgrab/i,
  /python-requests\/[01]\./i,
  /curl\/[0-6]\./i,
  /go-http-client\/1\./i,
  /scrapy/i,
  /wget/i,
];

function isSuspiciousUA(ua: string | null): boolean {
  if (!ua) return false;
  return BLOCKED_UA_PATTERNS.some((p) => p.test(ua));
}

/* ═══════════════════════════════════════════════════════
   BLOCKED PATHS — typowe próby exploitacji
═══════════════════════════════════════════════════════ */

const BLOCKED_PATHS = [
  "/wp-admin",
  "/wp-login",
  "/.env",
  "/.git",
  "/phpinfo",
  "/admin.php",
  "/config.php",
  "/xmlrpc.php",
  "/.htaccess",
  "/etc/passwd",
  "/proc/self",
];

function isBlockedPath(path: string): boolean {
  return BLOCKED_PATHS.some((p) => path.toLowerCase().startsWith(p));
}

/* ═══════════════════════════════════════════════════════
   MIDDLEWARE
═══════════════════════════════════════════════════════ */

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip           = getIP(req);
  const ua           = req.headers.get("user-agent");
  const isApi        = pathname.startsWith("/api");

  /* ── Block suspicious paths ── */
  if (isBlockedPath(pathname)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  /* ── Block suspicious user agents ── */
  if (isSuspiciousUA(ua)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  /* ── Rate limiting ── */
  const key    = isApi ? `api:${ip}` : `web:${ip}`;
  const maxReq = isApi ? RATE_LIMIT.apiMax : RATE_LIMIT.maxReqs;

  if (isRateLimited(key, maxReq)) {
    return new NextResponse(
      JSON.stringify({ error: "Too Many Requests", retryAfter: 60 }),
      {
        status:  429,
        headers: {
          "Content-Type":  "application/json",
          "Retry-After":   "60",
          "X-RateLimit-Limit":     String(maxReq),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  /* ── API: wymagaj HTTPS na produkcji ── */
  if (isApi && process.env.NODE_ENV === "production") {
    const proto = req.headers.get("x-forwarded-proto");
    if (proto && proto !== "https") {
      return NextResponse.redirect(
        `https://${req.headers.get("host")}${pathname}`,
        301
      );
    }
  }

  /* ── Dodaj security headers do response ── */
  const response = NextResponse.next();

  response.headers.set("X-Request-ID", crypto.randomUUID());
  response.headers.set(
    "X-RateLimit-Remaining",
    String(Math.max(0, maxReq - (rateMap.get(key)?.count ?? 0)))
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons/|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};