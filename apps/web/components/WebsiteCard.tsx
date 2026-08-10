"use client";

import type { Website } from "../lib/api";
import PulseLine from "./PulseLine";

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function WebsiteCard({ website }: { website: Website }) {
  const latestTick = website.ticks?.[0];
  const status = latestTick?.status ?? "Unknown";

  let hostname = website.url;
  try {
    hostname = new URL(website.url).hostname;
  } catch {
    // keep raw url if it doesn't parse
  }

  return (
    <div
      className="card"
      style={{
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--text)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={website.url}
          >
            {hostname}
          </div>
          <div
            className="mono"
            style={{
              fontSize: 12,
              color: "var(--text-faint)",
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {website.url}
          </div>
        </div>

        <span className={`pill ${status === "Up" ? "pillUp" : status === "Down" ? "pillDown" : "pillUnknown"}`}>
          <span className="dot" />
          {status}
        </span>
      </div>

      <PulseLine status={status} height={44} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid var(--border-soft)",
          paddingTop: 14,
        }}
      >
        <div>
          <div className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>
            Response
          </div>
          <div className="mono" style={{ fontSize: 14, color: "var(--text)", fontWeight: 600 }}>
            {latestTick ? `${latestTick.response_time_ms}ms` : "—"}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>
            Last check
          </div>
          <div className="mono" style={{ fontSize: 14, color: "var(--text)", fontWeight: 600 }}>
            {latestTick ? timeAgo(latestTick.createdAt) : "pending"}
          </div>
        </div>
      </div>
    </div>
  );
}
