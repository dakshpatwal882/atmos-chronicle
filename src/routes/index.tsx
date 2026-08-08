import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Astronomy } from "@/components/atmos/Astronomy";
import { CONDITION_NAMES, CONDITION_ORDER } from "@/components/atmos/atmosphere";
import { DailyTimeline } from "@/components/atmos/DailyTimeline";
import { Hero } from "@/components/atmos/Hero";
import { HourlyTimeline } from "@/components/atmos/HourlyTimeline";
import { Instruments } from "@/components/atmos/Instruments";
import { LoadingVeil } from "@/components/atmos/LoadingVeil";
import { Nav } from "@/components/atmos/Nav";
import { RadarMap } from "@/components/atmos/RadarMap";
import { Section } from "@/components/atmos/Section";
import { Visualisations } from "@/components/atmos/Visualisations";
import { DEFAULT_LOCATION, readWeather } from "@/lib/weather/service";
import type { DayPoint, GeoLocation, WeatherCondition } from "@/lib/weather/types";
import type { Unit } from "@/lib/weather/units";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATMOS — A Vintage Weather Observatory From The Future" },
      {
        name: "description",
        content:
          "Cinematic, interactive weather: live conditions, hourly scrubbing, seven-day timelines, solar arcs, lunar plates and radar, rendered as a vintage atmospheric observatory.",
      },
      { property: "og:title", content: "ATMOS — A Vintage Weather Observatory From The Future" },
      {
        property: "og:description",
        content:
          "An immersive weather experience: atmospheric depth, cinematic transitions and instrument-grade readings for any city on earth.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Atmos,
});

function Atmos() {
  const [location, setLocation] = useState<GeoLocation>(DEFAULT_LOCATION);
  const [unit, setUnit] = useState<Unit>("C");
  const [night, setNight] = useState(false);
  const [activeHour, setActiveHour] = useState(15);
  const [preview, setPreview] = useState<DayPoint | null>(null);
  const [manualCondition, setManualCondition] = useState<WeatherCondition | null>(null);

  const bundle = useMemo(() => readWeather(location), [location]);

  const condition: WeatherCondition =
    manualCondition ??
    preview?.condition ??
    (night ? "night" : (bundle.hourly[activeHour]?.condition ?? bundle.current.condition));

  const dayProgress = activeHour / 23;

  return (
    <div className={night ? "dark" : undefined}>
      <div className="min-h-screen bg-background text-foreground">
        <LoadingVeil />
        <Nav unit={unit} onUnit={setUnit} night={night} onNight={setNight} />

        <main>
          <Hero
            location={location}
            current={bundle.current}
            condition={condition}
            unit={unit}
            onSelectLocation={(l) => {
              setLocation(l);
              setManualCondition(null);
            }}
            timeShift={dayProgress}
          />

          <Section
            index="01"
            title="Current conditions"
            caption={`${location.city} · ${bundle.current.summary}`}
          >
            <Instruments current={bundle.current} air={bundle.airQuality} unit={unit} />
            {bundle.alerts.length > 0 && (
              <ul className="mt-10 space-y-3">
                {bundle.alerts.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-l-2 border-[var(--rust)] py-2 pl-4"
                  >
                    <span className="label-mono text-[var(--rust)]">{a.severity}</span>
                    <span className="font-display text-xl">{a.title}</span>
                    <span className="text-sm text-muted-foreground">{a.detail}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section
            id="forecast"
            index="02"
            title="Seven days ahead"
            caption="Hover a column to change the sky"
          >
            <DailyTimeline days={bundle.daily} unit={unit} onPreview={setPreview} />
          </Section>

          <Section
            index="03"
            title="Through the day"
            caption="Scrub the hour · the light follows"
          >
            <HourlyTimeline
              hours={bundle.hourly}
              unit={unit}
              activeHour={activeHour}
              onScrub={setActiveHour}
            />
          </Section>

          <Section index="04" title="Atmospheric readings" caption="Precipitation · Wind · Humidity">
            <Visualisations
              hours={bundle.hourly}
              humidity={bundle.current.humidity}
              windSpeed={bundle.current.windSpeed}
              windDirection={bundle.current.windDirection}
            />
          </Section>

          <Section id="map" index="05" title="Sun & moon" caption="Astronomical plate">
            <Astronomy sun={bundle.sun} moon={bundle.moon} progress={dayProgress} />
          </Section>

          <Section id="radar" index="06" title="Radar" caption="Composite reflectivity">
            <RadarMap location={location} />
          </Section>

          <Section
            id="about"
            index="07"
            title="Change the weather"
            caption="Every state is a different atmosphere"
          >
            <div className="flex flex-wrap gap-2">
              {CONDITION_ORDER.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setManualCondition(manualCondition === c ? null : c)}
                  aria-pressed={manualCondition === c}
                  className={`magnetic rounded-full border border-[var(--glass-line)] px-5 py-2.5 ${
                    manualCondition === c
                      ? "bg-foreground text-background"
                      : "hover:bg-foreground/[0.05]"
                  }`}
                >
                  <span className="label-mono text-current">{CONDITION_NAMES[c]}</span>
                </button>
              ))}
            </div>
            <p className="mt-10 max-w-2xl font-display text-2xl leading-snug md:text-3xl">
              ATMOS is an instrument, not a dashboard. Readings arrive through a service layer
              built for live providers — swap the source and every plate, arc and particle field
              redraws itself against real observations.
            </p>
          </Section>
        </main>

        <footer className="hairline mx-auto flex max-w-[1400px] flex-wrap items-baseline justify-between gap-4 px-5 py-10 md:px-10">
          <span className="font-display text-xl tracking-[0.18em]">ATMOS</span>
          <span className="label-mono">Observatory · demonstration data</span>
        </footer>
      </div>
    </div>
  );
}
