import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  return NextResponse.json({
    session_url: `${origin}/login/oauth2/auth`,
  });
}
