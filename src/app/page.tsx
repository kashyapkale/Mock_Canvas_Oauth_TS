export default function Home() {
  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        margin: 0,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          padding: "48px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#861F41", marginBottom: "8px" }}>
          Mock Canvas OAuth Server
        </h1>
        <p style={{ color: "#666", marginBottom: "32px", fontSize: "14px" }}>
          OAuth 2.0 mock for VT AI Lecture Assistant
        </p>
        <div style={{ textAlign: "left", background: "#f9f9f9", borderRadius: "8px", padding: "20px", fontSize: "14px", color: "#333", lineHeight: "1.8" }}>
          <strong>Endpoints:</strong>
          <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
            <li><code>/login/oauth2/auth</code> — Authorization</li>
            <li><code>/login/oauth2/token</code> — Token exchange</li>
            <li><code>/login/session_token</code> — Session token</li>
            <li><code>/api/v1/users/self</code> — User info</li>
          </ul>
        </div>
        <a
          href="/login/oauth2/auth?client_id=test&response_type=code&redirect_uri=http://localhost:3000&state=test123"
          style={{
            display: "inline-block",
            marginTop: "24px",
            padding: "12px 24px",
            background: "#861F41",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          Test OAuth Flow
        </a>
      </div>
    </div>
  );
}
