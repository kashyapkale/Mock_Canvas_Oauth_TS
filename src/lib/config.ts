function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

export const config = {
  get instructorAccessToken() { return required("OAUTH_INSTRUCTOR_ACCESS_TOKEN"); },
  get studentAccessToken() { return required("OAUTH_STUDENT_ACCESS_TOKEN"); },

  get instructorId() { return optional("OAUTH_INSTRUCTOR_ID", "101"); },
  get instructorName() { return optional("OAUTH_INSTRUCTOR_NAME", "Kashyap Kale"); },
  get instructorEmail() { return required("OAUTH_INSTRUCTOR_EMAIL"); },
  get instructorRefreshToken() { return optional("OAUTH_INSTRUCTOR_REFRESH_TOKEN", "refresh-token-instructor-67890"); },

  get studentId() { return optional("OAUTH_STUDENT_ID", "202"); },
  get studentName() { return optional("OAUTH_STUDENT_NAME", "Sarthak Raut"); },
  get studentEmail() { return required("OAUTH_STUDENT_EMAIL"); },
  get studentRefreshToken() { return optional("OAUTH_STUDENT_REFRESH_TOKEN", "refresh-token-student-fghij"); },
};
