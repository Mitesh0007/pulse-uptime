"use client";

type PulseLineProps = {
  status?: "Up" | "Down" | "Unknown";
  height?: number;
  animated?: boolean;
};

const COLORS: Record<string, string> = {
  Up: "var(--up)",
  Down: "var(--down)",
  Unknown: "var(--unknown)",
};

// A single-path "heartbeat" line. When status is Down, the line
// flattens into a near-flat trace with one broken spike, evoking
// a monitor losing signal rather than a healthy pulse.
function buildPath(flat: boolean) {
  if (flat) {
    return "M0,30 L60,30 L68,30 L74,10 L80,50 L86,30 L400,30";
  }
  return "M0,30 L40,30 L48,30 L56,8 L64,52 L72,18 L80,30 L120,30 L160,30 L168,30 L176,8 L184,52 L192,18 L200,30 L240,30 L280,30 L288,30 L296,8 L304,52 L312,18 L320,30 L360,30 L400,30";
}

export default function PulseLine({
  status = "Up",
  height = 60,
  animated = true,
}: PulseLineProps) {
  const color = COLORS[status] ?? COLORS.Unknown;
  const flat = status === "Down";
  const path = buildPath(flat);

  return (
    <svg
      viewBox="0 0 400 60"
      width="100%"
      height={height}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: "block", overflow: "visible" }}
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={status === "Unknown" ? 0.5 : 0.95}
        style={
          animated
            ? {
                strokeDasharray: 900,
                strokeDashoffset: 900,
                animation: `pulseDraw ${flat ? 3.2 : 2.4}s linear infinite`,
              }
            : undefined
        }
      />
      <style>{`
        @keyframes pulseDraw {
          0% { stroke-dashoffset: 900; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}
