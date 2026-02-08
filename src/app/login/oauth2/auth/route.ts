import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const responseType = searchParams.get("response_type");
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state") || "";
  const scope = searchParams.get("scope") || "";

  if (responseType !== "code") {
    return NextResponse.json(
      { error: "unsupported_response_type", error_description: "Only response_type=code is supported" },
      { status: 400 }
    );
  }

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "client_id and redirect_uri are required" },
      { status: 400 }
    );
  }

  const selectRoleUrl = new URL("/login/oauth2/select-role", request.nextUrl.origin);
  selectRoleUrl.searchParams.set("redirect_uri", redirectUri);
  selectRoleUrl.searchParams.set("state", state);
  selectRoleUrl.searchParams.set("client_id", clientId);
  selectRoleUrl.searchParams.set("scope", scope);

  return NextResponse.redirect(selectRoleUrl);
}
