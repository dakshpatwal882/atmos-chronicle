export type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "rain"
  | "thunderstorm"
  | "snow"
  | "fog"
  | "night";

export interface GeoLocation {
  id: string;
  city: string;
  region?: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  summary: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  dewPoint: number;
  observedAt: string;
}

export interface HourPoint {
  hour: number;
  label: string;
  temperature: number;
  condition: WeatherCondition;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

export interface DayPoint {
  date: string;
  weekday: string;
  condition: WeatherCondition;
  high: number;
  low: number;
  precipitation: number;
  windSpeed: number;
  summary: string;
}

export interface AirQuality {
  aqi: number;
  category: string;
  pm25: number;
  pm10: number;
}

export interface SunCycle {
  sunrise: string;
  sunset: string;
  dayLengthMinutes: number;
  solarNoon: string;
}

export interface MoonInfo {
  /** 0 = new moon, 0.5 = full moon, 1 = new moon again */
  phase: number;
  phaseName: string;
  illumination: number;
  moonrise: string;
  moonset: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  severity: "advisory" | "watch" | "warning";
  detail: string;
}

export interface WeatherBundle {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourPoint[];
  daily: DayPoint[];
  airQuality: AirQuality;
  sun: SunCycle;
  moon: MoonInfo;
  alerts: WeatherAlert[];
}
