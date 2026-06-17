import { NextRequest, NextResponse } from "next/server";

/* Prosty in-memory store — zastąp Vercel KV dla persistencji */
const clicks: Record<string, number> = {};

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Invalid content-type" }, { status: 415 });
  }

  let body: { link?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const link = String(body.link ?? "unknown").slice(0, 100);
  clicks[link] = (clicks[link] ?? 0) + 1;

  return NextResponse.json({ ok: true, clicks: clicks[link] });
}

export async function GET() {
  const sorted = Object.entries(clicks)
    .sort(([, a], [, b]) => b - a)
    .map(([link, count]) => ({ link, count }));

  return NextResponse.json({ ok: true, data: sorted });
}