export type Unit = "C" | "F";

export const toUnit = (celsius: number, unit: Unit) =>
  unit === "C" ? celsius : celsius * 1.8 + 32;

export const fmtTemp = (celsius: number, unit: Unit, digits = 0) =>
  `${toUnit(celsius, unit).toFixed(digits)}°`;

export const compass = (deg: number) => {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16] ?? "N";
};
