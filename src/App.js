"use client";

import { useState, useEffect } from "react";
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import ThemeToggle from './components/ThemeToggle';
import { Loader2, AlertCircle } from "lucide-react";
import "./styles.css";

export default function WeatherDashboard() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");
  const [history, setHistory] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  // Initialize theme and history from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(localStorage.getItem("theme") || "light");
      setHistory(JSON.parse(localStorage.getItem("searchHistory") || "[]"));
      setInitialLoad(false);
    }
  }, []);

  // Apply theme
  useEffect(() => {
    if (theme) {
      document.body.className = theme;
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const fetchWeather = async (city) => {
    try {
      setLoading(true);
      setError("");

      // Direct API calls to OpenWeatherMap using API key
      const API_KEY = '10ed30d24b883eaa43a2cb9ff0cbab55'; 

      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      );
      
      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json();
        throw new Error(errorData.message || 'Failed to fetch weather data');
      }
      
      const weatherData = await weatherResponse.json();
      
      const processedWeather = {
        city: weatherData.name,
        temp: weatherData.main.temp,
        condition: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        country: weatherData.sys.country
      };
      
      setWeather(processedWeather);

      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      );
      
      if (!forecastResponse.ok) {
        const errorData = await forecastResponse.json();
        throw new Error(errorData.message || 'Failed to fetch forecast data');
      }
      
      const forecastData = await forecastResponse.json();
      
      // Process the 5-day forecast
      const processedForecast = [];
      const today = new Date().setHours(0, 0, 0, 0);
      
      // Group by day and get one forecast per day
      const dailyData = {};
      
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toISOString().split('T')[0];
        
        if (!dailyData[dateKey] && date.setHours(0, 0, 0, 0) > today) {
          dailyData[dateKey] = item;
        }
      }
      
      // Convert to array and limit to 5 days
      Object.values(dailyData).slice(0, 5).forEach(item => {
        const date = new Date(item.dt * 1000);
        processedForecast.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main,
          icon: item.weather[0].icon
        });
      });
      
      setForecast(processedForecast);

      // Update search history
      const updatedHistory = [
        city,
        ...history.filter((c) => c.toLowerCase() !== city.toLowerCase()),
      ].slice(0, 5);
      
      setHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        err.message || "Could not fetch weather data. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${theme}`}>
      <header>
        <h1>Weather Dashboard</h1>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </header>

      <main>
        <SearchBar onSearch={fetchWeather} />

        {loading && (
          <div className="loading">
            <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
            <p>Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && weather && (
          <div className="weather-content">
            <WeatherCard weather={weather} />
            {forecast.length > 0 && <ForecastCard forecast={forecast} />}
          </div>
        )}

        {!loading && !error && !weather && !initialLoad && (
          <div className="welcome-message">
            <h2>Welcome to Weather Dashboard</h2>
            <p>Enter a city name above to get the current weather and forecast.</p>
          </div>
        )}

        {history.length > 0 && (
          <div className="history">
            <h3>Search History</h3>
            <ul>
              {history.map((city, index) => (
                <li key={index}>
                  <button onClick={() => fetchWeather(city)}>{city}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer>
        <p>Weather Dashboard &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}