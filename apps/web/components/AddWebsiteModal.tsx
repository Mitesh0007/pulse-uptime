"use client";

import { useState, type FormEvent } from "react";

type AddWebsiteModalProps = {
  onClose: () => void;
  onAdd: (url: string) => Promise<void>;
};

export default function AddWebsiteModal({ onClose, onAdd }: AddWebsiteModalProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError("Enter a URL to monitor.");
      return;
    }

    let normalized = url.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }

    setLoading(true);
    try {
      await onAdd(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add site.");
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add a website to monitor"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(5, 7, 10, 0.6)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 28,
          boxShadow: "var(--shadow-pop)",
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 6 }}>Add a site</h2>
        <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 20 }}>
          We&apos;ll start checking it on the next monitoring cycle.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="field">
            <label className="label" htmlFor="url">
              Website URL
            </label>
            <input
              id="url"
              className="input"
              type="text"
              placeholder="example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
            />
          </div>

          {error && <p className="errorText">{error}</p>}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <button type="button" className="btn btnGhost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btnPrimary" disabled={loading}>
              {loading ? "Adding…" : "Add site"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
