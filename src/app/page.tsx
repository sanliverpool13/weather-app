"use client";

import React, { useState } from "react";
import { fetchMatchingCities, fetchWeather } from "@/lib/api";
import { City } from "@/types";

const HomePage: React.FC = () => {
  const [input, setInput] = useState("");
  const [city, setCity] = useState<City | null>();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<
    {
      name: string;
      state: string | null;
      country: string | null;
      lat: number;
      lon: number;
    }[]
  >([]);

  let debounceTimer: NodeJS.Timeout;
  const debounceFetchCities = (city: string) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      if (city.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const cities = await fetchMatchingCities(city);
        setSuggestions(cities);
      } catch (err: any) {
        setError(err.message);
        setSuggestions([]);
      }
    }, 300);
  };

  const handleFetchWeather = async (cityInput?: City | null) => {
    console.log("city retrieved state", cityInput);
    const cityInputName = cityInput ? cityInput.name : null;
    const cityInputLat = cityInput ? cityInput.lat : null;
    const cityInputLon = cityInput ? cityInput.lon : null;
    console.log(cityInputName);

    if (!cityInputName || !cityInputName.trim()) {
      setError("Please enter a city name.");
      return;
    }

    if (!cityInputLat || !cityInputLon) {
      setError("City coordinates are invalid");
      return;
    }

    setError(null);
    setWeatherData(null);
    setLoading(true);

    try {
      const data = await fetchWeather(
        cityInputName.trim(),
        cityInputLat,
        cityInputLon
      );
      setWeatherData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    debounceFetchCities(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleFetchWeather();
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (city: {
    name: string;
    state: string | null;
    country: string | null;
    lat: number;
    lon: number;
  }) => {
    setInput(""); // Set the input to the selected city
    console.log("city from suggestions clicked", city);
    setCity(city);
    handleFetchWeather(city);
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Weather App</h1>
      <div className="w-80 max-w-md">
        <input
          type="text"
          className="w-full p-3 border rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter city name"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        {/* Dropdown for suggestions */}
        {suggestions.length > 0 && (
          <ul className="w-full text-black bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10">
            {suggestions.map((city, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(city)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              >
                {city.name}
                {city.state ? `, ${city.state}` : ""} ({city.country})
              </li>
            ))}
          </ul>
        )}
        <button
          className="w-full mt-4 bg-blue-500 text-white p-3 rounded-lg shadow hover:bg-blue-600 transition-colors"
          onClick={handleFetchWeather}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Get Weather"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {weatherData && (
        <div className="mt-6 bg-white shadow-lg rounded-lg p-4 max-w-md w-full">
          <h2 className="text-lg font-bold text-gray-700 mb-2">
            Weather in: {weatherData.name || city?.name}, {city?.state} (
            {city?.country})
          </h2>
          <p className="text-gray-600">
            Temperature: {Math.round(weatherData.main.temp)}°C
          </p>
          <p className="text-gray-600">
            Weather: {weatherData.weather[0].description}
          </p>
          <p className="text-gray-600">
            Humidity: {weatherData.main.humidity}%
          </p>
          <p className="text-gray-600">
            Wind Speed: {weatherData.wind.speed} m/s
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
