import { useState } from "react";
import { usePointerParallax, usePrefersReducedMotion, useCountUp } from "@/hooks/use-atmos";
import { ATMOSPHERES } from "./atmosphere";
import { ParticleField } from "./ParticleField";
import { SearchField } from "./SearchField";
import type { CurrentWeather, GeoLocation, WeatherCondition } from "@/lib/weather/types";
import { compass, fmtTemp, toUnit, type Unit } from "@/lib/weather/units";

type Region = "sky" | "sun" | "horizon" | null;

interface Props {
  location: GeoLocation;
  current: CurrentWeather;
  condition: WeatherCondition;
  unit: Unit;
  onSelectLocation: (l: GeoLocation) => void;
  timeShift: number; // 0..1 across the day, drives light temperature
}

export function Hero({ location, current, condition, unit, onSelectLocation, timeShift }: Props) {
  const reduced = usePrefersReducedMotion();
  const { ref, pointer } = usePointerParallax<HTMLDivElement>(reduced);
  const [region, setRegion] = useState<Region>(null);
  const atmos = ATMOSPHERES[condition];
  const temp = useCountUp(toUnit(current.temperature, unit), 1100);

  const intensity = region === "horizon" ? 0.9 : region === "sky" ? 0.4 : 0;
  const warmth = region === "sun" ? 1 : 0;
  const daylight = Math.sin(timeShift * Math.PI); // 0 at midnight, 1 at midday

  const layer = (depth: number) => ({
    transform: `translate3d(${pointer.x * depth * -26}px, ${pointer.y * depth * -16}px, 0) scale(${1 + depth * 0.02})`,
  });

  const readings: Array<[string, string]> = [
    ["Feels like", fmtTemp(current.feelsLike, unit)],
    ["Humidity", `${current.humidity}%`],
    ["Wind", `${current.windSpeed} km/h ${compass(current.windDirection)}`],
    ["Visibility", `${current.visibility} km`],
    ["UV index", `${current.uvIndex}`],
    ["Pressure", `${current.pressure} hPa`],
  ];

  return (
    <section
      id="top"
      ref={ref}
      className="grain relative isolate min-h-[100svh] w-full overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* photographic plate */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          key={atmos.image}
          src={atmos.image}
          alt=""
          width={1920}
          height={1088}
          fetchPriority="high"
          className="h-[112%] w-[112%] -translate-x-[5%] -translate-y-[5%] object-cover transition-[filter,opacity,transform] duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] will-change-transform"
          style={{
            ...layer(0.5),
            filter: `${atmos.grade} hue-rotate(${warmth * 8}deg) brightness(${0.94 + daylight * 0.12 + warmth * 0.1})`,
          }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ backgroundImage: atmos.wash }}
        />
        {/* sun / light bloom follows the pointer */}
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-[700ms]"
          style={{
            opacity: 0.5 + warmth * 0.5,
            background: `radial-gradient(46rem 32rem at ${pointer.nx * 100}% ${pointer.ny * 80}%, ${atmos.glow}, transparent 70%)`,
            mixBlendMode: "screen",
          }}
        />
        {/* lens flare on the sun region */}
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-[800ms]"
          style={{
            opacity: warmth * 0.8,
            background: `radial-gradient(9rem 9rem at ${pointer.nx * 100}% ${pointer.ny * 100}%, oklch(0.96 0.09 82 / .55), transparent 60%), radial-gradient(26rem 3rem at ${100 - pointer.nx * 100}% ${100 - pointer.ny * 100}%, oklch(0.9 0.08 60 / .25), transparent 70%)`,
            mixBlendMode: "screen",
          }}
        />
        {/* drifting cloud strata, three depths */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <div
            className="drift-slow absolute -top-10 left-0 h-[42%] w-[130%] opacity-40 blur-2xl"
            style={{
              ...layer(1.1),
              background:
                "radial-gradient(60% 60% at 20% 50%, oklch(0.95 0.02 88 / .5), transparent 70%), radial-gradient(50% 50% at 70% 40%, oklch(0.9 0.03 88 / .45), transparent 70%)",
            }}
          />
          <div
            className="drift-mid absolute top-[16%] left-0 h-[34%] w-[140%] opacity-50 blur-xl"
            style={{
              ...layer(1.7),
              background:
                "radial-gradient(50% 60% at 40% 50%, oklch(0.93 0.02 88 / .45), transparent 72%)",
              transformOrigin: region === "sky" ? "center" : "left",
            }}
          />
          <div
            className="drift-fast absolute top-[6%] left-0 h-[26%] w-[150%] opacity-35 blur-md"
            style={{
              ...layer(2.4),
              background:
                "radial-gradient(40% 60% at 65% 50%, oklch(0.97 0.02 88 / .4), transparent 70%)",
            }}
          />
        </div>

        <ParticleField atmosphere={atmos} pointer={pointer} intensity={intensity} reduced={reduced} />

        {/* light rays when hovering the clouds */}
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-[800ms]"
          style={{
            opacity: region === "sky" ? 0.35 : 0,
            background:
              "repeating-linear-gradient(102deg, oklch(0.98 0.03 84 / .28) 0 2px, transparent 2px 26px)",
            maskImage: "radial-gradient(70% 60% at 50% 0%, black, transparent 75%)",
            mixBlendMode: "screen",
          }}
        />
        {/* depth vignette, deepens over the horizon */}
        <div
          aria-hidden
          className="absolute inset-0 transition-[box-shadow,opacity] duration-[700ms]"
          style={{
            boxShadow: `inset 0 -22rem 18rem -14rem oklch(0.2 0.02 60 / ${0.55 + (region === "horizon" ? 0.2 : 0)})`,
          }}
        />
      </div>

      {/* interactive regions */}
      <div aria-hidden className="absolute inset-0 z-0 grid grid-rows-[1fr_1fr_0.8fr]">
        <div className="grid grid-cols-2" onMouseLeave={() => setRegion(null)}>
          <div onMouseEnter={() => setRegion("sky")} />
          <div onMouseEnter={() => setRegion("sun")} />
        </div>
        <div onMouseEnter={() => setRegion("sky")} />
        <div onMouseEnter={() => setRegion("horizon")} onMouseLeave={() => setRegion(null)} />
      </div>

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-between px-5 pt-28 pb-10 md:px-10 md:pt-32">
        <div className="pointer-events-auto flex flex-wrap items-start justify-between gap-6">
          <div style={layer(-0.14)} className="min-w-0">
            <p className="label-mono">Station · {location.timezone} · obs {current.observedAt}</p>
            <h1 className="mt-2 font-display text-4xl leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
              {location.city}
              <span className="block text-muted-foreground">
                {location.region ?? location.country}
              </span>
            </h1>
            <p className="label-mono mt-3 tabular-nums">
              {Math.abs(location.lat).toFixed(4)}°{location.lat >= 0 ? "N" : "S"} ·{" "}
              {Math.abs(location.lon).toFixed(4)}°{location.lon >= 0 ? "E" : "W"}
            </p>
          </div>
          <SearchField location={location} onSelect={onSelectLocation} />
        </div>

        <div
          className="pointer-events-auto mt-16 flex flex-wrap items-end justify-between gap-x-10 gap-y-8"
          style={layer(-0.28)}
        >
          <div className="min-w-0">
            <div className="flex items-start">
              <span className="font-display text-[clamp(6rem,20vw,16rem)] leading-[0.78] tracking-[-0.04em] tabular-nums">
                {Math.round(temp)}
              </span>
              <span className="mt-[0.6em] font-display text-[clamp(2rem,5vw,4rem)] leading-none text-muted-foreground">
                °{unit}
              </span>
            </div>
            <p className="mt-4 font-display text-2xl tracking-wide md:text-3xl">{current.summary}</p>
          </div>

          <dl className="grid w-full max-w-xl grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
            {readings.map(([k, v]) => (
              <div key={k} className="border-t border-[var(--glass-line)] pt-2">
                <dt className="label-mono">{k}</dt>
                <dd className="mt-1 font-mono text-sm tracking-wide tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
