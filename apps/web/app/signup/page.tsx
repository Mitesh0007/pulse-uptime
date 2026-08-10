"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import PulseLine from "../../components/PulseLine";
import { api, ApiError } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (username.trim().length < 3) {
      setError("Username should be at least 3 characters.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await api.signup(username.trim(), password);
      const { jwt } = await api.signin(username.trim(), password);
      login(jwt, username.trim());
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError("That username is already taken.");
      } else {
        setError("Could not create your account. Please try again.");
      }
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
            <h1 style={{ fontSize: 28, marginBottom: 8 }}>Create your account</h1>
            <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 28 }}>
              Start watching your first site in under a minute.
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
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="errorText">{error}</p>}

              <button type="submit" className="btn btnPrimary" disabled={loading} style={{ marginTop: 6 }}>
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p style={{ fontSize: 14, color: "var(--text-dim)", marginTop: 20 }}>
              Already have an account?{" "}
              <Link href="/signin" style={{ color: "var(--accent)" }}>
                Sign in
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
              <span className="pill pillUp" style={{ marginBottom: 16, display: "inline-flex" }}>
                <span className="dot" />
                Up
              </span>
              <PulseLine status="Up" height={70} />
              <p style={{ fontSize: 13, color: "var(--text-faint)", marginTop: 14 }}>
                One clean signal for every site you track.
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
