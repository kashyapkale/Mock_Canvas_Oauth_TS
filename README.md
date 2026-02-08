# Mock Canvas OAuth Server (TypeScript)

A lightweight Mock Canvas LMS OAuth 2.0 server built with Next.js and deployed on Vercel. Used by the VT AI Lecture Assistant for development and testing.

## Quick Start

```bash
npm install
cp .env.example .env   # Then edit with your token values
npm run dev             # Starts on http://localhost:3000
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OAUTH_INSTRUCTOR_ACCESS_TOKEN` | Yes | — | Access token returned for instructor role |
| `OAUTH_STUDENT_ACCESS_TOKEN` | Yes | — | Access token returned for student role |
| `OAUTH_INSTRUCTOR_ID` | No | `101` | Instructor user ID |
| `OAUTH_INSTRUCTOR_NAME` | No | `Kashyap Kale` | Instructor display name |
| `OAUTH_INSTRUCTOR_REFRESH_TOKEN` | No | `refresh-token-instructor-67890` | Instructor refresh token |
| `OAUTH_STUDENT_ID` | No | `202` | Student user ID |
| `OAUTH_STUDENT_NAME` | No | `Sarthak Raut` | Student display name |
| `OAUTH_STUDENT_REFRESH_TOKEN` | No | `refresh-token-student-fghij` | Student refresh token |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/login/oauth2/auth` | Authorization endpoint — redirects to role selection |
| GET | `/login/oauth2/select-role` | Role selection page (Instructor / Student) |
| POST | `/login/oauth2/select-role` | Processes role selection, redirects with auth code |
| POST | `/login/oauth2/token` | Token exchange (`authorization_code`, `refresh_token`, `client_credentials`) |
| DELETE | `/login/oauth2/token` | Logout / token revocation |
| GET | `/login/session_token` | Returns session URL |
| GET | `/api/v1/users/self` | Returns user details for a valid access token |

## OAuth Flow

1. Client redirects to `/login/oauth2/auth?client_id=X&response_type=code&redirect_uri=Y&state=Z`
2. User selects a role (Instructor or Student)
3. Server redirects to `redirect_uri?code=CODE&state=Z`
4. Client exchanges code for tokens via `POST /login/oauth2/token`
5. Client uses access token to call `/api/v1/users/self`

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Set the required environment variables in Vercel project settings.
