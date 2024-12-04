"use client";

import React, { useState } from "react";
import { fetchMatchingCities, fetchWeather } from "@/lib/api";
import { City, WeatherData } from "@/types";
import Tile from "@/components/Tile";
import {
  WiCloud,
  WiHumidity,
  WiStrongWind,
  WiThermometer,
} from "react-icons/wi";

const HomePage: React.FC = () => {
  const [input, setInput] = useState("");
  const [city, setCity] = useState<City | null>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
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
        {loading && <p className="mt-2 text-blue-500">Loading...</p>}
        {/* <button
          className="w-full mt-4 bg-blue-500 text-white p-3 rounded-lg shadow hover:bg-blue-600 transition-colors"
          onClick={handleFetchWeather}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Get Weather"}
        </button> */}
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {weatherData && (
        <div className="mt-6  p-4 max-w-md w-full">
          <h2 className="text-lg text-center font-bold text-gray-700 mb-2">
            Weather in: {weatherData.name || city?.name}, {city?.state} (
            {city?.country})
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {/* Temperature Tile */}
            <Tile
              title="Temperature"
              value={`${Math.round(weatherData.main.temp)}°C`}
              icon={<WiThermometer />}
            />
            {/* Weather Tile */}
            <Tile
              title="Weather"
              value={weatherData.weather[0].description}
              icon={<WiCloud />}
            />
            {/* Humidity Tile */}
            <Tile
              title="Humidity"
              value={`${weatherData.main.humidity}%`}
              icon={<WiHumidity />}
            />
            {/* Wind Speed Tile */}
            <Tile
              title="Wind Speed"
              value={`${weatherData.wind.speed} m/s`}
              icon={<WiStrongWind />}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
