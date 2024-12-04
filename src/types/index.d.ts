export interface City {
  name: string;
  state: string | null;
  country: string | null;
  lat: number;
  lon: number;
}

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number; // Optional, not always present
    grnd_level?: number; // Optional, not always present
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number; // Optional, not always present
  };
  rain?: {
    [key: string]: number; // Rain data can have different keys (e.g., "1h", "3h")
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number; // Optional, not always present
    id?: number; // Optional, not always present
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
