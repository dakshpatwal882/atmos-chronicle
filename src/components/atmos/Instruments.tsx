import type { AirQuality, CurrentWeather } from "@/lib/weather/types";
import { compass, fmtTemp, type Unit } from "@/lib/weather/units";
import { WeatherGlyph } from "./WeatherGlyph";

interface Props {
  current: CurrentWeather;
  air: AirQuality;
  unit: Unit;
}

export function Instruments({ current, air, unit }: Props) {
  const rows: Array<[string, string, string]> = [
    ["Humidity", `${current.humidity}`, "%"],
    ["Wind", `${current.windSpeed}`, `km/h ${compass(current.windDirection)}`],
    ["Pressure", `${current.pressure}`, "hPa"],
    ["Visibility", `${current.visibility}`, "km"],
    ["UV index", `${current.uvIndex}`, "of 11"],
    ["Dew point", `${current.dewPoint}`, "°C"],
    ["Air quality", `${air.aqi}`, "AQI"],
    ["Particulate", `${air.pm25}`, "PM2.5"],
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)]">
      <div className="lift plate rounded-xl p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="label-mono">Observed</p>
            <p className="mt-1 font-mono text-sm tabular-nums">{current.observedAt}</p>
          </div>
          <WeatherGlyph condition={current.condition} className="h-12 w-12 text-foreground/80" />
        </div>
        <p className="mt-8 font-display text-8xl leading-none tabular-nums">
          {fmtTemp(current.temperature, unit)}
        </p>
        <p className="mt-2 font-display text-2xl text-muted-foreground">{current.summary}</p>
        <p className="label-mono mt-6">Feels like {fmtTemp(current.feelsLike, unit)}</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-8 sm:grid-cols-3 xl:grid-cols-4">
        {rows.map(([label, value, suffix]) => (
          <div
            key={label}
            className="group border-t border-[var(--glass-line)] py-6 transition-colors duration-500 hover:border-[var(--rust)]"
          >
            <dt className="label-mono">{label}</dt>
            <dd className="mt-2 flex items-baseline gap-1.5">
              <span className="font-display text-4xl leading-none tabular-nums transition-transform duration-500 group-hover:translate-x-0.5">
                {value}
              </span>
              <span className="label-mono">{suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
