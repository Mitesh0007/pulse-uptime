"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import PulseLine from "../../../components/PulseLine";
import { api, type Website } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";

const POLL_INTERVAL_MS = 30_000;

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WebsiteDetailPage() {
  const { token, ready } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchWebsite = useCallback(
    async (silent = false) => {
      if (!token || !params.id) return;
      if (!silent) setLoading(true);
      try {
        const data = await api.getWebsiteStatus(token, params.id);
        setWebsite(data);
        setNotFound(false);
      } catch {
        setNotFound(true);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [token, params.id]
  );

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.push("/signin");
      return;
    }
    fetchWebsite();
    const interval = setInterval(() => fetchWebsite(true), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [ready, token, router, fetchWebsite]);

  if (!ready || !token) return null;

  const latestTick = website?.ticks?.[0];
  const status = latestTick?.status ?? "Unknown";

  return (
    <div className="shell">
      <Navbar />
      <main className="container" style={{ flex: 1, paddingTop: 32, paddingBottom: 60 }}>
        <Link href="/dashboard" className="mono" style={{ fontSize: 13, color: "var(--text-dim)" }}>
          ← Back to dashboard
        </Link>

        {loading ? (
          <div className="card" style={{ marginTop: 20, padding: 32, opacity: 0.5, height: 240 }} />
        ) : notFound || !website ? (
          <div className="card" style={{ marginTop: 20, padding: 40, textAlign: "center" }}>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Site not found</h3>
            <p style={{ fontSize: 14, color: "var(--text-dim)" }}>
              It may have been removed, or belongs to another account.
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 16,
                marginBottom: 24,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <h1 style={{ fontSize: 26, marginBottom: 4 }}>{website.url}</h1>
                <p className="mono" style={{ fontSize: 13, color: "var(--text-faint)" }}>
                  Region: India
                </p>
              </div>
              <span
                className={`pill ${status === "Up" ? "pillUp" : status === "Down" ? "pillDown" : "pillUnknown"}`}
              >
                <span className="dot" />
                {status}
              </span>
            </div>

            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <PulseLine status={status} height={90} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
                marginBottom: 28,
              }}
              className="statGrid"
            >
              <div className="card" style={{ padding: 20 }}>
                <div className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>
                  Latest response
                </div>
                <div className="mono" style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>
                  {latestTick ? `${latestTick.response_time_ms}ms` : "—"}
                </div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>
                  Last checked
                </div>
                <div className="mono" style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>
                  {latestTick ? formatTime(latestTick.createdAt) : "pending"}
                </div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>
                  Status
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    marginTop: 4,
                    color:
                      status === "Up" ? "var(--up)" : status === "Down" ? "var(--down)" : "var(--unknown)",
                  }}
                >
                  {status}
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: "var(--text-faint)" }}>
              This page refreshes automatically every 30 seconds.
            </p>
          </>
        )}
      </main>

      <style>{`
        @media (max-width: 700px) {
          .statGrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
