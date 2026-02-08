import { NextRequest, NextResponse } from "next/server";
import { decodeCode, getAccessToken, getRefreshToken, type Role } from "@/lib/tokenStore";
import { config } from "@/lib/config";

function buildTokenResponse(role: Role) {
  return {
    access_token: getAccessToken(role),
    token_type: "Bearer",
    refresh_token: getRefreshToken(role),
    expires_in: 3600,
    user: {
      id: parseInt(role === "instructor" ? config.instructorId : config.studentId),
      name: role === "instructor" ? config.instructorName : config.studentName,
    },
  };
}

export async function POST(request: NextRequest) {
  let grantType: string | null = null;
  let code: string | null = null;
  let refreshToken: string | null = null;

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    grantType = formData.get("grant_type") as string;
    code = formData.get("code") as string;
    refreshToken = formData.get("refresh_token") as string;
  } else {
    try {
      const body = await request.json();
      grantType = body.grant_type;
      code = body.code;
      refreshToken = body.refresh_token;
    } catch {
      return NextResponse.json(
        { error: "invalid_request", error_description: "Could not parse request body" },
        { status: 400 }
      );
    }
  }

  if (!grantType) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "grant_type is required" },
      { status: 400 }
    );
  }

  if (grantType === "authorization_code") {
    if (!code) {
      return NextResponse.json(
        { error: "invalid_request", error_description: "code is required for authorization_code grant" },
        { status: 400 }
      );
    }

    const role = decodeCode(code);
    if (!role) {
      return NextResponse.json(
        { error: "invalid_grant", error_description: "Invalid or expired authorization code" },
        { status: 400 }
      );
    }

    return NextResponse.json(buildTokenResponse(role));
  }

  if (grantType === "refresh_token") {
    if (!refreshToken) {
      return NextResponse.json(
        { error: "invalid_request", error_description: "refresh_token is required" },
        { status: 400 }
      );
    }

    if (refreshToken === config.instructorRefreshToken) {
      return NextResponse.json(buildTokenResponse("instructor"));
    }
    if (refreshToken === config.studentRefreshToken) {
      return NextResponse.json(buildTokenResponse("student"));
    }

    return NextResponse.json(
      { error: "invalid_grant", error_description: "Invalid refresh token" },
      { status: 400 }
    );
  }

  if (grantType === "client_credentials") {
    return NextResponse.json(buildTokenResponse("instructor"));
  }

  return NextResponse.json(
    { error: "unsupported_grant_type", error_description: `Unsupported grant_type: ${grantType}` },
    { status: 400 }
  );
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const expire = searchParams.get("expire");

  if (expire === "1") {
    return NextResponse.json({ forward_url: "/" });
  }

  return new NextResponse(null, { status: 200 });
}
