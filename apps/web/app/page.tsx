import Link from "next/link";
import Navbar from "../components/Navbar";
import PulseLine from "../components/PulseLine";

export default function Home() {
  return (
    <div className="shell">
      <Navbar />

      <main style={{ flex: 1 }}>
        <section className="container" style={{ paddingTop: 96, paddingBottom: 64 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 56,
              alignItems: "center",
            }}
            className="heroGrid"
          >
            <div>
              <span
                className="mono"
                style={{
                  display: "inline-block",
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  border: "1px solid var(--border)",
                  padding: "4px 10px",
                  borderRadius: 999,
                  marginBottom: 20,
                }}
              >
                Uptime, felt in real time
              </span>

              <h1 style={{ fontSize: 48, lineHeight: 1.08, marginBottom: 20 }}>
                Know the second
                <br />
                your site goes quiet.
              </h1>

              <p style={{ fontSize: 17, color: "var(--text-dim)", maxWidth: 480, marginBottom: 32 }}>
                Pulse checks your sites on a steady cadence and gives you a
                single heartbeat to watch. Add a URL, and we&apos;ll tell you
                the moment it stops responding.
              </p>

              <div style={{ display: "flex", gap: 12 }}>
                <Link href="/signup" className="btn btnPrimary" style={{ padding: "12px 22px", fontSize: 15 }}>
                  Start monitoring — it&apos;s free
                </Link>
                <Link href="/signin" className="btn btnGhost" style={{ padding: "12px 22px", fontSize: 15 }}>
                  Sign in
                </Link>
              </div>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <span className="mono" style={{ fontSize: 13, color: "var(--text-dim)" }}>
                  yourapp.com
                </span>
                <span className="pill pillUp">
                  <span className="dot" />
                  Up
                </span>
              </div>
              <PulseLine status="Up" height={80} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border-soft)" }}>
                <div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>Response</div>
                  <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>118ms</div>
                </div>
                <div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>Region</div>
                  <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>India</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>Uptime</div>
                  <div className="mono" style={{ fontSize: 15, fontWeight: 600, color: "var(--up)" }}>99.98%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container" style={{ paddingBottom: 96 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
            className="featureGrid"
          >
            {[
              {
                title: "Add a site in seconds",
                body: "Paste a URL and Pulse starts checking it automatically. No agents, no config files.",
              },
              {
                title: "A heartbeat, not a wall of logs",
                body: "Every check becomes one clear signal: steady and green, or flat and red.",
              },
              {
                title: "Checked from India",
                body: "Requests run from a dedicated monitoring region so you see what your users see.",
              },
            ].map((f) => (
              <div key={f.title} className="card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-dim)" }}>{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid var(--border-soft)", padding: "24px 0" }}>
        <div className="container" style={{ fontSize: 13, color: "var(--text-faint)" }}>
          Pulse — a demo uptime monitor.
        </div>
      </footer>

      <style>{`
        @media (max-width: 860px) {
          .heroGrid { grid-template-columns: 1fr !important; }
          .featureGrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
