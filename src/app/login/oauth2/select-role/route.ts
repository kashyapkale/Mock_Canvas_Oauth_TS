import { NextRequest, NextResponse } from "next/server";
import { generateCode } from "@/lib/tokenStore";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const redirectUri = searchParams.get("redirect_uri") || "";
  const state = searchParams.get("state") || "";
  const clientId = searchParams.get("client_id") || "";
  const scope = searchParams.get("scope") || "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mock Canvas - Select Role</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.1);
      padding: 48px;
      max-width: 420px;
      width: 100%;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #861F41;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #666;
      margin-bottom: 32px;
      font-size: 14px;
    }
    h2 {
      color: #333;
      margin-bottom: 24px;
      font-size: 20px;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 14px;
      margin: 12px 0;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.1s, box-shadow 0.2s;
    }
    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .btn:active { transform: translateY(0); }
    .btn-instructor {
      background: #861F41;
      color: white;
    }
    .btn-student {
      background: #E87722;
      color: white;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Mock Canvas LMS</div>
    <div class="subtitle">OAuth 2.0 Authorization</div>
    <h2>Select Your Role</h2>
    <form method="POST" action="/login/oauth2/select-role">
      <input type="hidden" name="redirect_uri" value="${escapeHtml(redirectUri)}" />
      <input type="hidden" name="state" value="${escapeHtml(state)}" />
      <input type="hidden" name="client_id" value="${escapeHtml(clientId)}" />
      <input type="hidden" name="scope" value="${escapeHtml(scope)}" />
      <button type="submit" name="role" value="instructor" class="btn btn-instructor">
        Sign in as Instructor
      </button>
      <button type="submit" name="role" value="student" class="btn btn-student">
        Sign in as Student
      </button>
    </form>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const role = formData.get("role") as string;
  const redirectUri = formData.get("redirect_uri") as string;
  const state = formData.get("state") as string;

  if (!role || (role !== "instructor" && role !== "student")) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "role must be 'instructor' or 'student'" },
      { status: 400 }
    );
  }

  if (!redirectUri) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "redirect_uri is required" },
      { status: 400 }
    );
  }

  const code = generateCode(role);

  const callbackUrl = new URL(redirectUri);
  callbackUrl.searchParams.set("code", code);
  if (state) {
    callbackUrl.searchParams.set("state", state);
  }

  return NextResponse.redirect(callbackUrl, 302);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
