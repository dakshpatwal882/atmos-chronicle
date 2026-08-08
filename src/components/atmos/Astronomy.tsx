import type { MoonInfo, SunCycle } from "@/lib/weather/types";

interface Props {
  sun: SunCycle;
  moon: MoonInfo;
  /** 0..1 position through the day */
  progress: number;
}

export function Astronomy({ sun, moon, progress }: Props) {
  const angle = Math.PI * progress;
  const cx = 10 + progress * 80;
  const cy = 78 - Math.sin(angle) * 58;
  const isDay = progress > 0.08 && progress < 0.92;

  // moon terminator: offset a shadow disc by phase
  // shadow disc slides fully off the disc at full moon, covers it at new moon
  const shift = (moon.phase < 0.5 ? -1 : 1) * (moon.illumination / 100) * 1.06;

  return (
    <div className="grid gap-px md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <figure className="plate relative overflow-hidden p-7">
        <figcaption className="label-mono">Solar arc</figcaption>
        <div className="relative mt-6">
          <svg viewBox="0 0 100 90" className="h-56 w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="skyBand" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--dusty)" stopOpacity="0.35" />
                <stop offset="18%" stopColor="var(--rust)" stopOpacity="0.5" />
                <stop offset="50%" stopColor="var(--amber)" stopOpacity="0.55" />
                <stop offset="82%" stopColor="var(--rust)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--dusty)" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <path d="M10 78 Q 50 -6 90 78" fill="none" stroke="url(#skyBand)" strokeWidth="1.4" />
            <line x1="0" y1="78" x2="100" y2="78" stroke="var(--glass-line)" />
            <circle
              cx={cx}
              cy={cy}
              r="4.2"
              fill={isDay ? "var(--amber)" : "var(--muted-foreground)"}
              className="transition-all duration-700 ease-out"
            />
            <circle
              cx={cx}
              cy={cy}
              r="10"
              fill={isDay ? "var(--amber)" : "var(--dusty)"}
              opacity="0.18"
              className="breathe transition-all duration-700 ease-out"
            />
          </svg>
          <ol className="mt-4 grid grid-cols-4 gap-2">
            {[
              ["Sunrise", sun.sunrise],
              ["Solar noon", sun.solarNoon],
              ["Sunset", sun.sunset],
              ["Day length", `${Math.floor(sun.dayLengthMinutes / 60)}h ${sun.dayLengthMinutes % 60}m`],
            ].map(([k, v]) => (
              <li key={k} className="border-t border-[var(--glass-line)] pt-2">
                <p className="label-mono">{k}</p>
                <p className="mt-1 font-mono text-sm tabular-nums">{v}</p>
              </li>
            ))}
          </ol>
        </div>
      </figure>

      <figure className="plate p-7">
        <figcaption className="label-mono">Lunar plate</figcaption>
        <div className="mt-6 grid place-items-center">
          <div
            className="relative h-40 w-40 overflow-hidden rounded-full"
            style={{
              background:
                "radial-gradient(circle at 34% 30%, oklch(0.93 0.02 88), oklch(0.72 0.03 84) 62%, oklch(0.55 0.03 80))",
              boxShadow: "inset -10px -8px 24px oklch(0.3 0.02 70 / .55), 0 20px 50px -30px oklch(0 0 0 / .7)",
              transform: `rotate(${shift * 6}deg)`,
              transition: "transform 900ms cubic-bezier(.22,1,.36,1)",
            }}
          >
            {[
              [30, 34, 16],
              [58, 26, 10],
              [46, 62, 22],
              [72, 58, 9],
            ].map(([x, y, s], i) => (
              <span
                key={i}
                className="absolute rounded-full opacity-40"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${s}%`,
                  height: `${s}%`,
                  background:
                    "radial-gradient(circle at 40% 35%, oklch(0.6 0.02 80 / .8), oklch(0.75 0.02 84 / .1))",
                }}
              />
            ))}
            <span
              className="absolute inset-[-2%] rounded-full"
              style={{
                background: "oklch(0.16 0.014 250 / 0.94)",
                transform: `translateX(${shift * 96}%)`,
                transition: "transform 1100ms cubic-bezier(.22,1,.36,1)",
              }}
            />
          </div>
          <p className="mt-6 font-display text-2xl">{moon.phaseName}</p>
          <p className="label-mono mt-1">{moon.illumination}% illuminated</p>
          <dl className="mt-6 grid w-full grid-cols-2 gap-4">
            {[
              ["Moonrise", moon.moonrise],
              ["Moonset", moon.moonset],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-[var(--glass-line)] pt-2">
                <dt className="label-mono">{k}</dt>
                <dd className="mt-1 font-mono text-sm tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </figure>
    </div>
  );
}
