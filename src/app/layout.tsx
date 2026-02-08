import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mock Canvas OAuth Server",
  description: "Mock Canvas LMS OAuth 2.0 server for VT AI Lecture Assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
