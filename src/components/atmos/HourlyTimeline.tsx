import { useCallback, useEffect, useRef, useState } from "react";
import type { HourPoint } from "@/lib/weather/types";
import { fmtTemp, toUnit, type Unit } from "@/lib/weather/units";
import { WeatherGlyph } from "./WeatherGlyph";

interface Props {
  hours: HourPoint[];
  unit: Unit;
  activeHour: number;
  onScrub: (hour: number) => void;
}

const W = 1000;
const H = 220;

export function HourlyTimeline({ hours, unit, activeHour, onScrub }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const temps = hours.map((h) => toUnit(h.temperature, unit));
  const min = Math.min(...temps) - 2;
  const max = Math.max(...temps) + 2;
  const x = (i: number) => (i / (hours.length - 1)) * W;
  const y = (t: number) => H - ((t - min) / (max - min)) * (H - 40) - 20;

  const path = temps
    .map((t, i) => {
      if (i === 0) return `M ${x(0)} ${y(t)}`;
      const px = x(i - 1);
      const py = y(temps[i - 1]!);
      const cx = (px + x(i)) / 2;
      return `C ${cx} ${py} ${cx} ${y(t)} ${x(i)} ${y(t)}`;
    })
    .join(" ");

  const active = hours[activeHour] ?? hours[0]!;

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      onScrub(Math.round(ratio * (hours.length - 1)));
    },
    [hours.length, onScrub],
  );

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => setFromClientX(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging, setFromClientX]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end">
      <div
        ref={trackRef}
        className="relative touch-pan-y select-none"
        onPointerDown={(e) => {
          setDragging(true);
          setFromClientX(e.clientX);
        }}
        role="slider"
        tabIndex={0}
        aria-label="Scrub through the hourly forecast"
        aria-valuemin={0}
        aria-valuemax={23}
        aria-valuenow={activeHour}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onScrub(Math.min(23, activeHour + 1));
          if (e.key === "ArrowLeft") onScrub(Math.max(0, activeHour - 1));
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="hourFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--rust)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--rust)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((g) => (
            <line
              key={g}
              x1={0}
              x2={W}
              y1={20 + g * (H - 40)}
              y2={20 + g * (H - 40)}
              stroke="var(--glass-line)"
              strokeDasharray="2 6"
            />
          ))}
          <path d={`${path} L ${W} ${H} L 0 ${H} Z`} fill="url(#hourFill)" />
          <path
            d={path}
            fill="none"
            stroke="var(--rust)"
            strokeWidth="1.6"
            strokeLinecap="round"
            style={{ strokeDasharray: 3000, animation: "dash-in 2.4s cubic-bezier(.22,1,.36,1) forwards", ["--dash" as string]: 3000 }}
          />
          <line
            x1={x(activeHour)}
            x2={x(activeHour)}
            y1={0}
            y2={H}
            stroke="var(--foreground)"
            strokeOpacity="0.35"
            className="transition-all duration-300 ease-out"
          />
          <circle
            cx={x(activeHour)}
            cy={y(temps[activeHour] ?? 0)}
            r="5"
            fill="var(--background)"
            stroke="var(--rust)"
            strokeWidth="1.6"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        <ol className="mt-3 flex justify-between">
          {hours
            .filter((_, i) => i % 3 === 0)
            .map((h) => (
              <li key={h.hour}>
                <button
                  type="button"
                  onClick={() => onScrub(h.hour)}
                  className={`label-mono transition-colors duration-300 ${
                    Math.abs(h.hour - activeHour) < 2 ? "text-foreground" : "hover:text-foreground"
                  }`}
                >
                  {h.label}
                </button>
              </li>
            ))}
        </ol>
        <p className="label-mono mt-4">Drag across the timeline</p>
      </div>

      <div className="plate rounded-xl p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="label-mono">{active.label}</span>
          <WeatherGlyph condition={active.condition} className="h-8 w-8 text-foreground/80" />
        </div>
        <p className="mt-4 font-display text-6xl leading-none tabular-nums">
          {fmtTemp(active.temperature, unit)}
        </p>
        <dl className="mt-6 space-y-2">
          {[
            ["Precip", `${active.precipitation}%`],
            ["Wind", `${active.windSpeed} km/h`],
            ["Humidity", `${active.humidity}%`],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between border-t border-[var(--glass-line)] pt-2">
              <dt className="label-mono">{k}</dt>
              <dd className="font-mono text-sm tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
