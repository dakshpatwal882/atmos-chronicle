/**
 * Weather service layer.
 *
 * Swap `MOCK` for a real provider by implementing the same surface:
 * every UI component consumes only the types in ./types, so a live API
 * (OpenWeather, Open-Meteo, Tomorrow.io …) can be dropped in here without
 * touching a single component.
 */
import { buildBundle, LOCATIONS } from "./mock";
import type { GeoLocation, WeatherBundle } from "./types";

export const DEFAULT_LOCATION: GeoLocation = LOCATIONS[0]!;

const cache = new Map<string, WeatherBundle>();

export function searchLocations(query: string): GeoLocation[] {
  const q = query.trim().toLowerCase();
  if (!q) return LOCATIONS.slice(0, 5);
  return LOCATIONS.filter((l) =>
    `${l.city} ${l.region ?? ""} ${l.country}`.toLowerCase().includes(q),
  ).slice(0, 6);
}

/** Current conditions + hourly + daily + air quality + astronomy + alerts. */
export async function fetchWeather(location: GeoLocation): Promise<WeatherBundle> {
  const cached = cache.get(location.id);
  if (cached) return cached;
  const bundle = buildBundle(location);
  cache.set(location.id, bundle);
  return bundle;
}

/** Synchronous read used for the first paint (no network in mock mode). */
export function readWeather(location: GeoLocation): WeatherBundle {
  const cached = cache.get(location.id);
  if (cached) return cached;
  const bundle = buildBundle(location);
  cache.set(location.id, bundle);
  return bundle;
}

export { LOCATIONS };
