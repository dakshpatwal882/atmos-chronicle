import type { WeatherCondition } from "@/lib/weather/types";

interface Props {
  condition: WeatherCondition;
  className?: string;
}

/** Hand-drawn instrument-style weather glyphs (no icon-library defaults). */
export function WeatherGlyph({ condition, className = "h-8 w-8" }: Props) {
  const stroke = "currentColor";
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 1.1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden role="presentation">
      {(condition === "clear" || condition === "partly-cloudy") && (
        <g {...common} className="origin-center">
          <circle cx={condition === "clear" ? 24 : 19} cy={condition === "clear" ? 24 : 20} r="8" />
          {condition === "clear" &&
            Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1={24 + Math.cos((i * Math.PI) / 4) * 12}
                y1={24 + Math.sin((i * Math.PI) / 4) * 12}
                x2={24 + Math.cos((i * Math.PI) / 4) * 16}
                y2={24 + Math.sin((i * Math.PI) / 4) * 16}
              />
            ))}
        </g>
      )}
      {(condition === "partly-cloudy" ||
        condition === "cloudy" ||
        condition === "rain" ||
        condition === "thunderstorm" ||
        condition === "snow") && (
        <path
          {...common}
          d="M16 32h16a6 6 0 0 0 .6-11.97A9 9 0 0 0 15.2 21.5 5.5 5.5 0 0 0 16 32Z"
        />
      )}
      {condition === "rain" && (
        <g {...common}>
          {[18, 24, 30].map((x, i) => (
            <line key={x} x1={x} y1={36 + i * 0} x2={x - 2} y2={42} />
          ))}
        </g>
      )}
      {condition === "thunderstorm" && (
        <path {...common} d="M26 34l-6 6h6l-3 6" />
      )}
      {condition === "snow" && (
        <g {...common}>
          {[18, 24, 30].map((x) => (
            <g key={x}>
              <line x1={x} y1={37} x2={x} y2={43} />
              <line x1={x - 2.6} y1={38.5} x2={x + 2.6} y2={41.5} />
              <line x1={x + 2.6} y1={38.5} x2={x - 2.6} y2={41.5} />
            </g>
          ))}
        </g>
      )}
      {condition === "fog" && (
        <g {...common}>
          {[18, 24, 30, 36].map((y, i) => (
            <line key={y} x1={10 + (i % 2) * 4} y1={y} x2={38 - (i % 2) * 3} y2={y} />
          ))}
        </g>
      )}
      {condition === "night" && (
        <path {...common} d="M30 12a13 13 0 1 0 8 20A14 14 0 0 1 30 12Z" />
      )}
    </svg>
  );
}
