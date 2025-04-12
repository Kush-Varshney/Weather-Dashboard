"use client"

import { Droplets, Wind } from "lucide-react"

const WeatherCard = ({ weather }) => {
  if (!weather) return null

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>{weather.city}</h2>
        <p className="current-date">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="weather-body">
        <div className="weather-main">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
            alt={weather.condition}
            className="weather-icon"
            width="120"
            height="120"
          />
          <div className="temperature">
            <h3>{Math.round(weather.temp)}°C</h3>
            <p className="condition">{weather.condition}</p>
          </div>
        </div>

        <div className="weather-details">
          <div className="detail">
            <Droplets className="h-6 w-6 mb-2 text-blue-500" />
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{weather.humidity}%</span>
          </div>

          <div className="detail">
            <Wind className="h-6 w-6 mb-2 text-blue-500" />
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">{weather.windSpeed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
