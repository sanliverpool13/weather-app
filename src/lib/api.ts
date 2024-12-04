const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = process.env.WEATHER_API_KEY;

export const getCityCoordinates = async (city: string) => {
  const url = `${API_BASE_URL}?q=${city}&appid=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch coordinates for city: ${city}`);
    }

    const data = await response.json();

    if (data.coord) {
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

export const fetchWeather = async (city: string) => {
  try {
    const { lat, lon } = await getCityCoordinates(city);

    const url = `${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch weather data for city (Status): ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in fetchWeather: ${error}`);
    throw new Error(`Unable to fetch weather data: ${error}`);
  }
};
