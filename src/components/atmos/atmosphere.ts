import clear from "@/assets/sky-clear.jpg";
import fog from "@/assets/sky-fog.jpg";
import night from "@/assets/sky-night.jpg";
import partly from "@/assets/sky-partly-cloudy.jpg";
import rain from "@/assets/sky-rain.jpg";
import storm from "@/assets/sky-storm.jpg";
import type { WeatherCondition } from "@/lib/weather/types";

export interface Atmosphere {
  image: string;
  /** css filter applied to the plate for vintage grading */
  grade: string;
  /** overlay wash gradient */
  wash: string;
  particle: "dust" | "rain" | "snow" | "mist" | "spark" | "star";
  density: number;
  glow: string;
}

export const ATMOSPHERES: Record<WeatherCondition, Atmosphere> = {
  clear: {
    image: clear,
    grade: "sepia(0.28) saturate(0.85) contrast(1.05) brightness(1.02)",
    wash: "linear-gradient(180deg, oklch(0.78 0.09 70 / 0.25), transparent 45%, oklch(0.3 0.03 60 / 0.55))",
    particle: "dust",
    density: 60,
    glow: "oklch(0.86 0.12 78 / 0.55)",
  },
  "partly-cloudy": {
    image: partly,
    grade: "sepia(0.24) saturate(0.9) contrast(1.06)",
    wash: "linear-gradient(180deg, oklch(0.7 0.06 240 / 0.22), transparent 40%, oklch(0.28 0.03 60 / 0.6))",
    particle: "dust",
    density: 48,
    glow: "oklch(0.85 0.1 80 / 0.45)",
  },
  cloudy: {
    image: partly,
    grade: "sepia(0.3) saturate(0.65) contrast(0.98) brightness(0.94)",
    wash: "linear-gradient(180deg, oklch(0.6 0.02 250 / 0.4), transparent 45%, oklch(0.25 0.02 60 / 0.65))",
    particle: "mist",
    density: 36,
    glow: "oklch(0.8 0.03 90 / 0.3)",
  },
  rain: {
    image: rain,
    grade: "sepia(0.2) saturate(0.75) contrast(1.1) brightness(0.9)",
    wash: "linear-gradient(180deg, oklch(0.4 0.03 245 / 0.45), transparent 40%, oklch(0.2 0.02 250 / 0.7))",
    particle: "rain",
    density: 240,
    glow: "oklch(0.7 0.05 60 / 0.35)",
  },
  thunderstorm: {
    image: storm,
    grade: "sepia(0.24) saturate(0.7) contrast(1.16) brightness(0.84)",
    wash: "linear-gradient(180deg, oklch(0.3 0.02 60 / 0.5), transparent 38%, oklch(0.17 0.02 60 / 0.78))",
    particle: "rain",
    density: 320,
    glow: "oklch(0.9 0.08 85 / 0.4)",
  },
  snow: {
    image: fog,
    grade: "sepia(0.12) saturate(0.5) contrast(1.02) brightness(1.06)",
    wash: "linear-gradient(180deg, oklch(0.85 0.02 240 / 0.35), transparent 45%, oklch(0.4 0.02 240 / 0.55))",
    particle: "snow",
    density: 130,
    glow: "oklch(0.92 0.02 240 / 0.4)",
  },
  fog: {
    image: fog,
    grade: "sepia(0.34) saturate(0.55) contrast(0.92) brightness(1.04)",
    wash: "linear-gradient(180deg, oklch(0.88 0.03 88 / 0.4), transparent 50%, oklch(0.45 0.03 88 / 0.5))",
    particle: "mist",
    density: 44,
    glow: "oklch(0.9 0.04 88 / 0.35)",
  },
  night: {
    image: night,
    grade: "sepia(0.18) saturate(0.8) contrast(1.14) brightness(0.86)",
    wash: "linear-gradient(180deg, oklch(0.2 0.03 260 / 0.6), transparent 45%, oklch(0.12 0.02 260 / 0.85))",
    particle: "star",
    density: 90,
    glow: "oklch(0.8 0.06 80 / 0.3)",
  },
};

export const CONDITION_ORDER: WeatherCondition[] = [
  "clear",
  "partly-cloudy",
  "cloudy",
  "rain",
  "thunderstorm",
  "snow",
  "fog",
  "night",
];

export const CONDITION_NAMES: Record<WeatherCondition, string> = {
  clear: "Clear",
  "partly-cloudy": "Partly Cloudy",
  cloudy: "Cloudy",
  rain: "Rain",
  thunderstorm: "Thunderstorm",
  snow: "Snow",
  fog: "Fog",
  night: "Night",
};
