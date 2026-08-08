import { useReveal } from "@/hooks/use-atmos";
import type { HourPoint } from "@/lib/weather/types";
import { compass } from "@/lib/weather/units";

interface Props {
  hours: HourPoint[];
  humidity: number;
  windSpeed: number;
  windDirection: number;
}

export function Visualisations({ hours, humidity, windSpeed, windDirection }: Props) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.25);

  return (
    <div ref={ref} className="grid gap-px overflow-hidden md:grid-cols-3">
      <figure className="plate p-7">
        <figcaption className="label-mono mb-6">Precipitation probability</figcaption>
        <div className="flex h-40 items-end gap-1.5">
          {hours
            .filter((_, i) => i % 2 === 0)
            .map((h, i) => (
              <div key={h.hour} className="group relative flex-1">
                <div
                  className="w-full rounded-t-[2px] bg-gradient-to-t from-[var(--dusty)]/30 to-[var(--dusty)] transition-[height,opacity] duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:opacity-100"
                  style={{
                    height: visible ? `${Math.max(4, h.precipitation) * 1.4}px` : "2px",
                    transitionDelay: `${i * 45}ms`,
                    opacity: 0.75,
                  }}
                />
                <span className="label-mono absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {h.precipitation}
                </span>
              </div>
            ))}
        </div>
      </figure>

      <figure className="plate p-7">
        <figcaption className="label-mono mb-6">
          Wind field · {windSpeed} km/h {compass(windDirection)}
        </figcaption>
        <div className="relative h-40 overflow-hidden">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-px w-[45%] bg-gradient-to-r from-transparent via-[var(--olive)] to-transparent opacity-60"
              style={{
                top: `${8 + i * 11}%`,
                animation: `drift ${9 + (i % 4) * 2.5}s linear infinite alternate`,
                animationDelay: `${i * -1.3}s`,
                transform: `rotate(${(windDirection % 20) - 10}deg)`,
              }}
            />
          ))}
          <svg viewBox="0 0 100 100" className="absolute right-2 bottom-2 h-16 w-16 opacity-70" aria-hidden>
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--glass-line)" />
            <line
              x1="50"
              y1="50"
              x2={50 + Math.sin((windDirection * Math.PI) / 180) * 34}
              y2={50 - Math.cos((windDirection * Math.PI) / 180) * 34}
              stroke="var(--rust)"
              strokeWidth="1.6"
            />
            {["N", "E", "S", "W"].map((d, i) => (
              <text
                key={d}
                x={50 + Math.sin((i * Math.PI) / 2) * 46}
                y={52 - Math.cos((i * Math.PI) / 2) * 46}
                textAnchor="middle"
                fontSize="9"
                fill="var(--muted-foreground)"
                fontFamily="var(--font-mono)"
              >
                {d}
              </text>
            ))}
          </svg>
        </div>
      </figure>

      <figure className="plate grid place-items-center p-7">
        <figcaption className="label-mono mb-6 self-start">Relative humidity</figcaption>
        <div className="relative grid h-40 w-40 place-items-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-line)" strokeWidth="4" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--dusty)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={264}
              strokeDashoffset={visible ? 264 - (humidity / 100) * 264 : 264}
              style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(.22,1,.36,1)" }}
            />
          </svg>
          <div className="breathe absolute inset-6 rounded-full bg-[var(--dusty)]/10" />
          <span className="relative font-display text-5xl tabular-nums">{humidity}%</span>
        </div>
      </figure>
    </div>
  );
}
