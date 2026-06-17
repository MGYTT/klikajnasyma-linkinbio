import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({
    ok:          true,
    service:     "klikajnasyma.pl",
    timestamp:   new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version:     process.env.npm_package_version ?? "1.0.0",
  });
}