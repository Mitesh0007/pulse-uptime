"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import WebsiteCard from "../../components/WebsiteCard";
import AddWebsiteModal from "../../components/AddWebsiteModal";
import { api, type Website } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

const POLL_INTERVAL_MS = 30_000;

export default function DashboardPage() {
  const { token, ready } = useAuth();
  const router = useRouter();

  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchWebsites = useCallback(
    async (silent = false) => {
      if (!token) return;
      if (!silent) setLoading(true);
      try {
        const { websites: sites } = await api.getWebsites(token);
        setWebsites(sites);
        setError(null);
      } catch {
        setError("Couldn't load your sites. Retrying shortly.");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.push("/signin");
      return;
    }
    fetchWebsites();

    const interval = setInterval(() => fetchWebsites(true), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [ready, token, router, fetchWebsites]);

  async function handleAddWebsite(url: string) {
    if (!token) return;
    await api.addWebsite(token, url);
    setShowAddModal(false);
    fetchWebsites(true);
  }

  if (!ready || (!token && ready)) {
    return null;
  }

  const upCount = websites.filter((w) => w.ticks?.[0]?.status === "Up").length;
  const downCount = websites.filter((w) => w.ticks?.[0]?.status === "Down").length;

  return (
    <div className="shell">
      <Navbar />
      <main className="container" style={{ flex: 1, paddingTop: 40, paddingBottom: 60 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 28,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ fontSize: 26, marginBottom: 6 }}>Your sites</h1>
            <p className="mono" style={{ fontSize: 13, color: "var(--text-dim)" }}>
              {websites.length} monitored
              {websites.length > 0 && (
                <>
                  {" · "}
                  <span style={{ color: "var(--up)" }}>{upCount} up</span>
                  {downCount > 0 && (
                    <>
                      {" · "}
                      <span style={{ color: "var(--down)" }}>{downCount} down</span>
                    </>
                  )}
                </>
              )}
            </p>
          </div>
          <button className="btn btnPrimary" onClick={() => setShowAddModal(true)}>
            + Add site
          </button>
        </div>

        {error && (
          <div
            className="card"
            style={{ padding: 16, marginBottom: 20, borderColor: "var(--down)" }}
          >
            <p className="errorText">{error}</p>
          </div>
        )}

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="card" style={{ padding: 20, height: 190, opacity: 0.5 }} />
            ))}
          </div>
        ) : websites.length === 0 ? (
          <div
            className="card"
            style={{
              padding: 48,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <h3 style={{ fontSize: 18 }}>Nothing to watch yet</h3>
            <p style={{ fontSize: 14, color: "var(--text-dim)", maxWidth: 360 }}>
              Add your first site and Pulse will start checking it on the
              next monitoring cycle.
            </p>
            <button className="btn btnPrimary" onClick={() => setShowAddModal(true)} style={{ marginTop: 8 }}>
              + Add your first site
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {websites.map((site) => (
              <Link key={site.id} href={`/website/${site.id}`} style={{ display: "block" }}>
                <WebsiteCard website={site} />
              </Link>
            ))}
          </div>
        )}
      </main>

      {showAddModal && (
        <AddWebsiteModal onClose={() => setShowAddModal(false)} onAdd={handleAddWebsite} />
      )}
    </div>
  );
}
