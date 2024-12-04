"use client";

import React, { useState } from "react";
import { fetchWeather } from "@/lib/api";

const HomePage: React.FC = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setError(null);
    setWeatherData(null);
    setLoading(true);

    try {
      const data = await fetchWeather(city.trim());
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
    setCity(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleFetchWeather();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Weather App</h1>
      <div className="w-full max-w-md">
        <input
          type="text"
          className="w-full p-3 border rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter city name"
          value={city}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
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
            Weather in {weatherData.name}
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
