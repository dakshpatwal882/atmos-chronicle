import { useState } from "react";
import type { DayPoint } from "@/lib/weather/types";
import { fmtTemp, type Unit } from "@/lib/weather/units";
import { WeatherGlyph } from "./WeatherGlyph";

interface Props {
  days: DayPoint[];
  unit: Unit;
  onPreview: (d: DayPoint | null) => void;
}

export function DailyTimeline({ days, unit, onPreview }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const highs = days.map((d) => d.high);
  const lows = days.map((d) => d.low);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const span = Math.max(1, max - min);

  return (
    <div
      className="-mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:overflow-visible md:px-0"
      onMouseLeave={() => {
        setActive(null);
        onPreview(null);
      }}
    >
      <ol className="flex min-w-[52rem] items-stretch gap-px md:min-w-0">
        {days.map((d, i) => {
          const isActive = active === i;
          const topPct = ((max - d.high) / span) * 100;
          const botPct = ((d.low - min) / span) * 100;
          return (
            <li
              key={d.date}
              className="group relative flex-1 transition-[flex-grow] duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)]"
              style={{ flexGrow: isActive ? 1.7 : 1 }}
              onMouseEnter={() => {
                setActive(i);
                onPreview(d);
              }}
            >
              <div
                className={`relative flex h-[24rem] flex-col justify-between border-l border-[var(--glass-line)] px-4 py-5 transition-colors duration-[600ms] ${
                  isActive ? "bg-foreground/[0.05]" : "bg-transparent"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="label-mono">{d.weekday}</span>
                  <span className="label-mono tabular-nums">{d.date.slice(5)}</span>
                </div>

                <div className="pointer-events-none absolute inset-x-4 top-16 bottom-24">
                  <div
                    className="absolute left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-[var(--rust)] to-[var(--dusty)] transition-all duration-[700ms] ease-[cubic-bezier(.22,1,.36,1)]"
                    style={{ top: `${topPct}%`, bottom: `${botPct}%`, opacity: isActive ? 1 : 0.45 }}
                  />
                  <div
                    className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--rust)] transition-all duration-[700ms]"
                    style={{ top: `calc(${topPct}% - 3px)` }}
                  />
                </div>

                <div className="relative flex flex-col items-center gap-3">
                  <WeatherGlyph
                    condition={d.condition}
                    className={`h-10 w-10 transition-transform duration-[700ms] ${isActive ? "scale-125" : ""}`}
                  />
                  <div className="text-center">
                    <p className="font-display text-3xl leading-none tabular-nums">
                      {fmtTemp(d.high, unit)}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground tabular-nums">
                      {fmtTemp(d.low, unit)}
                    </p>
                  </div>
                  <p className="label-mono tabular-nums">{d.precipitation}% precip</p>
                  <div
                    className="overflow-hidden text-center transition-all duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)]"
                    style={{ maxHeight: isActive ? "4rem" : 0, opacity: isActive ? 1 : 0 }}
                  >
                    <p className="font-display text-lg">{d.summary}</p>
                    <p className="label-mono">wind {d.windSpeed} km/h</p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
