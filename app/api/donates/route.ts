import { NextRequest, NextResponse } from "next/server";

/* ═══════════════════════════════════════════════════════
   IN-MEMORY STORE
   (zastąp Vercel KV dla persistencji między deployami)
═══════════════════════════════════════════════════════ */

interface Donate {
  name:      string;
  amount:    string;
  emoji:     string;
  timestamp: string;
}

let donates: Donate[] = [
  { name: "Iza",        amount: "2,00 PLN", emoji: "💛", timestamp: new Date().toISOString() },
  { name: "Akwasowiec", amount: "6,00 PLN", emoji: "🔥", timestamp: new Date().toISOString() },
];

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */

function validateToken(req: NextRequest): boolean {
  const secret = req.headers.get("x-secret-token");
  return secret === process.env.DONATE_SECRET;
}

function sanitize(str: string, maxLen = 50): string {
  return str
    .trim()
    .slice(0, maxLen)
    .replace(/[<>'"&]/g, ""); // strip XSS chars
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin":  "https://klikajnasyma.pl",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-secret-token",
  };
}

/* ═══════════════════════════════════════════════════════
   OPTIONS — preflight CORS
═══════════════════════════════════════════════════════ */

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

/* ═══════════════════════════════════════════════════════
   GET — pobierz listę
═══════════════════════════════════════════════════════ */

export async function GET() {
  return NextResponse.json(donates, {
    headers: {
      ...corsHeaders(),
      "Cache-Control": "public, max-age=30, stale-while-revalidate=15",
    },
  });
}

/* ═══════════════════════════════════════════════════════
   POST — dodaj donate
═══════════════════════════════════════════════════════ */

export async function POST(req: NextRequest) {
  /* Auth */
  if (!validateToken(req)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders() }
    );
  }

  /* Content-Type check */
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415, headers: corsHeaders() }
    );
  }

  /* Parse body */
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400, headers: corsHeaders() }
    );
  }

  /* Validate fields */
  if (!body.name || !body.amount) {
    return NextResponse.json(
      { error: "Pola name i amount są wymagane" },
      { status: 422, headers: corsHeaders() }
    );
  }

  /* Sanitize & save */
  const entry: Donate = {
    name:      sanitize(body.name,   40),
    amount:    sanitize(body.amount, 20),
    emoji:     sanitize(body.emoji ?? "💛", 4),
    timestamp: new Date().toISOString(),
  };

  donates = [entry, ...donates].slice(0, 20); // max 20 wpisów

  return NextResponse.json(
    { ok: true, entry },
    { status: 201, headers: corsHeaders() }
  );
}