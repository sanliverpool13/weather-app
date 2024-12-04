const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const GEO_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

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

export const fetchCities = async (query: string) => {
  const url = `${GEO_BASE_URL}?q=${query}&limit=5&appid=${API_KEY}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch cities for query: ${query}`);
    }

    const data = await response.json();

    if (!data.length) {
      throw new Error("No matching cities found.");
    }

    return data;
  } catch (error) {
    console.error(`Error in fetchCities: ${error}`);
    throw new Error(`Unable to fetch cities: ${error}`);
  }
};

export const fetchWeather = async (city: string) => {
  try {
    const { lat, lon } = await getCityCoordinates(city);
    const cities = await fetchCities(city);
    console.log("citis", cities);
    console.log(`lat: ${lat} lon: ${lon}`);

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
