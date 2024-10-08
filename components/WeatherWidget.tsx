"use client";
import React from "react";
import { Cloud, MapPin, Thermometer } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}
const WeatherWidget = () => {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //This instructs the form to prevent the user from refreshing the page when clicking the submit button. Everything should remain on the same page!
    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Please enter a valid location");
      setWeather(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      console.error("Error Fetching weather Data:", error);
      setError("City Not Found. Please Try Again!");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  function getTempMsg(temperature: number, unit: string): string {
    if (unit === "C") {
      if (temperature < 0) {
        return `Its freezing at ${temperature}°C, Bundle up!`;
      } else if (temperature < 10) {
        return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
      } else if (temperature < 20) {
        return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
      } else if (temperature < 30) {
        return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`;
      } else {
        return `It is hot ${temperature}°C. Stay Hydrated!`;
      }
    } else {
      return `${temperature}°${unit}`;
    }
  }

  function getWeatherMsg(description: string): string {
    switch (description.toLowerCase()) {
      case "sunny":
        return "It's a beautiful sunny day!";
      case "partly cloudy":
        return "Expect some clouds and sunshine.";
      case "cloudy":
        return "It's cloudy today.";
      case "overcast":
        return "The sky is overcast.";
      case "rain":
        return "Don't forget your umbrella! It's raining.";
      case "thunderstorm":
        return "Thunderstorms are expected today.";
      case "snow":
        return "Bundle up! It's snowing.";
      case "mist":
        return "It's misty outside.";
      case "fog":
        return "Be careful, there's fog outside.";
      default:
        return description;
    }
  }
  function getLocationMsg(location: string): string {
    const currHour = new Date().getHours();
    const isNight = currHour >= 18 || currHour < 6;

    return `${location} ${isNight ? "at Night" : "During the Day"}`;
  }
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-md m-auto text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Weather Widget
            </CardTitle>
            <CardDescription>
              Search for the current weather conditions in your city.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <Input
                className="focus:outline-none outline-none   "
                type="text"
                placeholder="Enter a City Name"
                value={location}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLocation(e.target.value)
                }
              />
              <Button type="submit" disabled={isLoading}>
                {" "}
                {isLoading ? "Loading..." : "Search"}
              </Button>
            </form>
            {error && <div className="mt-4 text-red-600"> {error}</div>}
            {weather && (
              <div className="mt-5">
                <div className="flex gap-3 mb-3">
                  <Thermometer className="w-5 h-5" />
                  {getTempMsg(weather.temperature, weather.unit)}
                </div>
                <div className="flex gap-3 mb-3">
                  <Cloud className="w-5 h-5" />
                  <div>{getWeatherMsg(weather.description)}</div>
                </div>
                <div className="flex gap-3 mb-3">
                  <MapPin className="w-5 h-5" />
                  <div>{getLocationMsg(weather.location)}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
export default WeatherWidget;
