import { randomUUID } from "crypto";
import { config } from "./config";

export type Role = "instructor" | "student";

interface CodePayload {
  role: Role;
  nonce: string;
}

export function generateCode(role: Role): string {
  const payload: CodePayload = { role, nonce: randomUUID() };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function decodeCode(code: string): Role | null {
  try {
    const json = Buffer.from(code, "base64url").toString("utf-8");
    const payload: CodePayload = JSON.parse(json);
    if (payload.role === "instructor" || payload.role === "student") {
      return payload.role;
    }
    return null;
  } catch {
    return null;
  }
}

export function getRoleForAccessToken(token: string): Role | null {
  if (token === config.instructorAccessToken) return "instructor";
  if (token === config.studentAccessToken) return "student";
  return null;
}

export function getAccessToken(role: Role): string {
  return role === "instructor" ? config.instructorAccessToken : config.studentAccessToken;
}

export function getRefreshToken(role: Role): string {
  return role === "instructor" ? config.instructorRefreshToken : config.studentRefreshToken;
}

export interface UserDetails {
  id: number;
  name: string;
  sortable_name: string;
  short_name: string;
  login_id: string;
  email: string;
  locale: string | null;
  effective_locale: string;
  created_at: string;
  enrollments: Array<{ type: string; role: string; enrollment_state: string }>;
}

export function getUserDetails(role: Role): UserDetails {
  if (role === "instructor") {
    const name = config.instructorName;
    const nameParts = name.split(" ");
    const sortable = nameParts.length >= 2
      ? `${nameParts[nameParts.length - 1]}, ${nameParts.slice(0, -1).join(" ")}`
      : name;
    return {
      id: parseInt(config.instructorId),
      name,
      sortable_name: sortable,
      short_name: name,
      login_id: config.instructorEmail.split("@")[0],
      email: config.instructorEmail,
      locale: null,
      effective_locale: "en",
      created_at: "2024-01-01T00:00:00Z",
      enrollments: [{ type: "TeacherEnrollment", role: "TeacherEnrollment", enrollment_state: "active" }],
    };
  }

  const name = config.studentName;
  const nameParts = name.split(" ");
  const sortable = nameParts.length >= 2
    ? `${nameParts[nameParts.length - 1]}, ${nameParts.slice(0, -1).join(" ")}`
    : name;
  return {
    id: parseInt(config.studentId),
    name,
    sortable_name: sortable,
    short_name: name,
    login_id: config.studentEmail.split("@")[0],
    email: config.studentEmail,
    locale: null,
    effective_locale: "en",
    created_at: "2024-01-01T00:00:00Z",
    enrollments: [{ type: "StudentEnrollment", role: "StudentEnrollment", enrollment_state: "active" }],
  };
}
