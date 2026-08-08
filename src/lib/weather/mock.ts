import type {
  DayPoint,
  GeoLocation,
  HourPoint,
  WeatherBundle,
  WeatherCondition,
} from "./types";

export const LOCATIONS: GeoLocation[] = [
  { id: "new-delhi", city: "New Delhi", region: "Delhi", country: "India", lat: 28.6139, lon: 77.209, timezone: "IST" },
  { id: "mumbai", city: "Mumbai", region: "Maharashtra", country: "India", lat: 19.076, lon: 72.8777, timezone: "IST" },
  { id: "bengaluru", city: "Bengaluru", region: "Karnataka", country: "India", lat: 12.9716, lon: 77.5946, timezone: "IST" },
  { id: "reykjavik", city: "Reykjavík", country: "Iceland", lat: 64.1466, lon: -21.9426, timezone: "GMT" },
  { id: "kyoto", city: "Kyoto", country: "Japan", lat: 35.0116, lon: 135.7681, timezone: "JST" },
  { id: "lisbon", city: "Lisbon", country: "Portugal", lat: 38.7223, lon: -9.1393, timezone: "WET" },
  { id: "marrakesh", city: "Marrakesh", country: "Morocco", lat: 31.6295, lon: -7.9811, timezone: "WEST" },
  { id: "oslo", city: "Oslo", country: "Norway", lat: 59.9139, lon: 10.7522, timezone: "CET" },
  { id: "san-francisco", city: "San Francisco", region: "California", country: "United States", lat: 37.7749, lon: -122.4194, timezone: "PST" },
  { id: "buenos-aires", city: "Buenos Aires", country: "Argentina", lat: -34.6037, lon: -58.3816, timezone: "ART" },
  { id: "cairo", city: "Cairo", country: "Egypt", lat: 30.0444, lon: 31.2357, timezone: "EET" },
  { id: "edinburgh", city: "Edinburgh", country: "Scotland", lat: 55.9533, lon: -3.1883, timezone: "GMT" },
];

const CONDITION_SUMMARY: Record<WeatherCondition, string> = {
  clear: "Clear",
  "partly-cloudy": "Partly Cloudy",
  cloudy: "Overcast",
  rain: "Rain",
  thunderstorm: "Thunderstorm",
  snow: "Snow",
  fog: "Fog",
  night: "Clear Night",
};

export const conditionLabel = (c: WeatherCondition) => CONDITION_SUMMARY[c];

/** deterministic pseudo-random so SSR and client agree */
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const CONDITION_POOL: WeatherCondition[] = [
  "clear",
  "partly-cloudy",
  "cloudy",
  "rain",
  "thunderstorm",
  "fog",
];

function hourLabel(h: number) {
  const suffix = h < 12 ? "AM" : "PM";
  const base = h % 12 === 0 ? 12 : h % 12;
  return `${base} ${suffix}`;
}

function moonPhaseName(phase: number) {
  if (phase < 0.03 || phase > 0.97) return "New Moon";
  if (phase < 0.22) return "Waxing Crescent";
  if (phase < 0.28) return "First Quarter";
  if (phase < 0.47) return "Waxing Gibbous";
  if (phase < 0.53) return "Full Moon";
  if (phase < 0.72) return "Waning Gibbous";
  if (phase < 0.78) return "Last Quarter";
  return "Waning Crescent";
}

export function buildBundle(location: GeoLocation): WeatherBundle {
  const rand = seeded(location.id);
  const isDelhi = location.id === "new-delhi";
  const baseTemp = isDelhi ? 28 : Math.round(6 + rand() * 26);
  const condition: WeatherCondition = isDelhi
    ? "partly-cloudy"
    : (CONDITION_POOL[Math.floor(rand() * CONDITION_POOL.length)] ?? "clear");

  const hourly: HourPoint[] = Array.from({ length: 24 }, (_, h) => {
    const diurnal = Math.sin(((h - 9) / 24) * Math.PI * 2) * 5.5;
    const noise = (rand() - 0.5) * 1.6;
    const nightly = h < 5 || h > 20;
    return {
      hour: h,
      label: hourLabel(h),
      temperature: Math.round((baseTemp + diurnal + noise) * 10) / 10,
      condition: nightly ? "night" : condition,
      precipitation: Math.max(0, Math.round((rand() * 60 - 12) )),
      windSpeed: Math.round(6 + rand() * 16),
      humidity: Math.round(45 + rand() * 35),
    };
  });

  const start = new Date(Date.UTC(2026, 7, 8));
  const daily: DayPoint[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start.getTime() + i * 86400000);
    const c = CONDITION_POOL[Math.floor(rand() * CONDITION_POOL.length)] ?? "clear";
    const high = Math.round(baseTemp + 2 + rand() * 6);
    return {
      date: d.toISOString().slice(0, 10),
      weekday: WEEKDAYS[d.getUTCDay()] ?? "MON",
      condition: c,
      high,
      low: high - Math.round(5 + rand() * 6),
      precipitation: Math.round(rand() * 90),
      windSpeed: Math.round(5 + rand() * 20),
      summary: CONDITION_SUMMARY[c],
    };
  });

  const phase = Math.round(rand() * 100) / 100;

  return {
    location,
    current: {
      temperature: baseTemp,
      feelsLike: baseTemp + (isDelhi ? 3 : Math.round(rand() * 4 - 2)),
      condition,
      summary: CONDITION_SUMMARY[condition],
      humidity: isDelhi ? 62 : Math.round(40 + rand() * 45),
      windSpeed: isDelhi ? 14 : Math.round(4 + rand() * 22),
      windDirection: Math.round(rand() * 359),
      pressure: isDelhi ? 1012 : Math.round(996 + rand() * 28),
      visibility: isDelhi ? 8 : Math.round(3 + rand() * 12),
      uvIndex: isDelhi ? 5 : Math.round(rand() * 10),
      dewPoint: Math.round(baseTemp - 6 - rand() * 5),
      observedAt: "15:40",
    },
    hourly,
    daily,
    airQuality: {
      aqi: isDelhi ? 148 : Math.round(18 + rand() * 120),
      category: isDelhi ? "Unhealthy for sensitive groups" : "Moderate",
      pm25: Math.round(8 + rand() * 70),
      pm10: Math.round(14 + rand() * 90),
    },
    sun: {
      sunrise: "05:42",
      sunset: "19:08",
      dayLengthMinutes: 806,
      solarNoon: "12:25",
    },
    moon: {
      phase,
      phaseName: moonPhaseName(phase),
      illumination: Math.round((1 - Math.abs(0.5 - phase) * 2) * 100),
      moonrise: "20:14",
      moonset: "07:03",
    },
    alerts: isDelhi
      ? [
          {
            id: "haze",
            title: "Haze advisory",
            severity: "advisory",
            detail: "Reduced visibility expected between 21:00 and 07:00 across the plain.",
          },
        ]
      : [],
  };
}
