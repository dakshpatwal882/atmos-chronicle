import { useState } from "react";
import type { GeoLocation } from "@/lib/weather/types";

const LAYERS = ["Rain", "Clouds", "Temperature", "Wind"] as const;
type Layer = (typeof LAYERS)[number];

const LAYER_COLOR: Record<Layer, string> = {
  Rain: "var(--dusty)",
  Clouds: "var(--sepia)",
  Temperature: "var(--rust)",
  Wind: "var(--olive)",
};

interface Props {
  location: GeoLocation;
}

export function RadarMap({ location }: Props) {
  const [layer, setLayer] = useState<Layer>("Rain");
  const color = LAYER_COLOR[layer];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <div
        className="grain relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[var(--glass-line)]"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, oklch(0.28 0.02 60), oklch(0.18 0.016 250) 70%)",
        }}
      >
        {/* old cartography grid + contours */}
        <svg viewBox="0 0 160 100" className="absolute inset-0 h-full w-full" aria-hidden>
          <g stroke="oklch(0.85 0.03 88 / .12)" strokeWidth="0.25">
            {Array.from({ length: 17 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" />
            ))}
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 10} x2="160" y2={i * 10} />
            ))}
          </g>
          <g fill="none" stroke="oklch(0.82 0.05 84 / .28)" strokeWidth="0.4">
            {Array.from({ length: 7 }).map((_, i) => (
              <path
                key={i}
                d={`M ${8 + i * 6} 82 C ${34 + i * 5} ${58 - i * 5}, ${86 - i * 4} ${74 - i * 6}, ${146 - i * 5} ${40 + i * 4}`}
              />
            ))}
          </g>
          {/* weather field blobs */}
          <g style={{ transition: "opacity 600ms ease" }}>
            {[
              [46, 40, 20],
              [96, 58, 26],
              [124, 30, 14],
              [66, 74, 16],
            ].map(([cx, cy, r], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill={color}
                opacity={0.14 + i * 0.04}
                style={{ filter: "blur(3px)", transition: "fill 700ms ease" }}
              />
            ))}
          </g>
          <circle cx="80" cy="52" r="1.6" fill="var(--amber)" />
          <text
            x="84"
            y="50"
            fontSize="4"
            fill="oklch(0.88 0.03 88 / .8)"
            fontFamily="var(--font-mono)"
            letterSpacing="0.4"
          >
            {location.city.toUpperCase()}
          </text>
        </svg>

        {/* radar sweep */}
        <div className="absolute top-1/2 left-1/2 aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2">
          {[0.35, 0.62, 0.88].map((s) => (
            <div
              key={s}
              className="absolute inset-0 m-auto rounded-full border border-[oklch(0.85_0.03_88_/_.16)]"
              style={{ width: `${s * 100}%`, height: `${s * 100}%` }}
            />
          ))}
          <div className="sweep absolute inset-0">
            <div
              className="absolute top-1/2 left-1/2 h-1/2 w-1/2 origin-top-left"
              style={{
                background: `conic-gradient(from 0deg, ${color} 0deg, transparent 42deg)`,
                opacity: 0.22,
                borderRadius: "0 100% 0 0",
                transform: "translate(-100%, -100%) rotate(90deg)",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 h-px w-1/2 origin-left"
              style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
            />
          </div>
        </div>

        <div className="absolute bottom-3 left-4 flex gap-6">
          <span className="label-mono">Sweep 6s</span>
          <span className="label-mono">Range 240 km</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {LAYERS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLayer(l)}
            aria-pressed={layer === l}
            className={`magnetic flex items-center justify-between rounded-lg border border-[var(--glass-line)] px-4 py-3 text-left ${
              layer === l ? "bg-foreground/[0.06]" : "hover:bg-foreground/[0.03]"
            }`}
          >
            <span className="label-mono text-foreground">{l}</span>
            <span
              className="h-2 w-2 rounded-full transition-opacity duration-500"
              style={{ background: LAYER_COLOR[l], opacity: layer === l ? 1 : 0.3 }}
            />
          </button>
        ))}
        <p className="label-mono mt-4 leading-relaxed">
          Composite of surface stations and synthetic reflectivity, redrawn every six seconds.
        </p>
      </div>
    </div>
  );
}
