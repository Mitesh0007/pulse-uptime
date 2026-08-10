"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import PulseLine from "../../components/PulseLine";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

export default function SigninPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }

    setLoading(true);
    try {
      const { jwt } = await api.signin(username.trim(), password);
      login(jwt, username.trim());
      router.push("/dashboard");
    } catch {
      setError("Incorrect username or password.");
      setLoading(false);
    }
  }

  return (
    <div className="shell">
      <Navbar />
      <main
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "stretch",
        }}
        className="authGrid"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          }}
        >
          <div style={{ width: "100%", maxWidth: 380 }}>
            <h1 style={{ fontSize: 28, marginBottom: 8 }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 28 }}>
              Sign in to see how your sites are doing.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field">
                <label className="label" htmlFor="username">Username</label>
                <input
                  id="username"
                  className="input"
                  type="text"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="password">Password</label>
                <input
                  id="password"
                  className="input"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="errorText">{error}</p>}

              <button type="submit" className="btn btnPrimary" disabled={loading} style={{ marginTop: 6 }}>
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p style={{ fontSize: 14, color: "var(--text-dim)", marginTop: 20 }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" style={{ color: "var(--accent)" }}>
                Create one
              </Link>
            </p>
          </div>
        </div>

        <div
          className="authArt"
          style={{
            background: "var(--bg-elevated)",
            borderLeft: "1px solid var(--border-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          }}
        >
          <div style={{ width: "100%", maxWidth: 360 }}>
            <div className="card" style={{ padding: 24 }}>
              <span className="pill pillDown" style={{ marginBottom: 16, display: "inline-flex" }}>
                <span className="dot" />
                Down
              </span>
              <PulseLine status="Down" height={70} />
              <p style={{ fontSize: 13, color: "var(--text-faint)", marginTop: 14 }}>
                The moment something flatlines, you&apos;ll know.
              </p>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 860px) {
          .authGrid { grid-template-columns: 1fr !important; }
          .authArt { display: none !important; }
        }
      `}</style>
    </div>
  );
}
