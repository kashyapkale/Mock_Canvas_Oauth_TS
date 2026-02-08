import { NextRequest, NextResponse } from "next/server";
import { getRoleForAccessToken, getUserDetails } from "@/lib/tokenStore";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  let token = searchParams.get("access_token");

  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }

  if (!token) {
    return NextResponse.json(
      { errors: [{ message: "Invalid access token." }] },
      { status: 401 }
    );
  }

  const role = getRoleForAccessToken(token);
  if (!role) {
    return NextResponse.json(
      { errors: [{ message: "Invalid access token." }] },
      { status: 401 }
    );
  }

  return NextResponse.json(getUserDetails(role));
}
