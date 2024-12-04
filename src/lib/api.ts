import { GEO_BASE_URL, API_BASE_URL, API_KEY } from "@/constants";
import { City } from "@/types";

export const getCityCoordinates = async (city: string) => {
  console.log("api key", API_KEY);

  const url = `${API_BASE_URL}?q=${city.toLowerCase()}&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    console.log("response coord", response);

    if (!response.ok) {
      throw new Error(`Failed to fetch coordinates for city: ${city}`);
    }

    const data = await response.json();

    if (!data.coord) {
      throw new Error(`No coordinates found for city: ${city}`);
    }

    return {
      lat: data.coord.lat,
      lon: data.coord.lon,
    };
  } catch (error) {
    console.log(`Error in getting city coordinates: ${error}`);
    throw new Error(`Unable to get city coordinates: ${error}`);
  }
};

export const fetchMatchingCities = async (query: string) => {
  console.log(`query ${query}`);
  const url = `${GEO_BASE_URL}?q=${query}&limit=5&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    console.log("city response");

    if (!response.ok) {
      throw new Error(`Failed to fetch cities for query: ${query}`);
    }

    const data = await response.json();

    if (!data.length) {
      throw new Error("No matching cities found.");
    }

    const cities: City[] = data.map((location: any) => ({
      name: location.name,
      state: location.state || null,
      country: location.country || null,
      lat: location.lat,
      lon: location.lon,
    }));
    return cities;
  } catch (error) {
    console.error(`Error in fetchMatchingCities: ${error}`);
    throw new Error(`Unable to fetch matching cities: ${error}`);
  }
};

export const fetchWeather = async (city: string, lon: number, lat: number) => {
  try {
    // const { lat, lon } = await getCityCoordinates(city);

    const url = `${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch weather data for city (Status): ${response.status}`
      );
    }

    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error(`Error in fetchWeather: ${error}`);
    throw new Error(`Unable to fetch weather data: ${error}`);
  }
};
