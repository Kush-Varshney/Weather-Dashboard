"use client"

const ForecastCard = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null

  return (
    <div className="forecast-container">
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-day">
            <p className="forecast-date">{day.date}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.condition}
              className="forecast-icon"
              width="50"
              height="50"
            />
            <p className="forecast-temp">{day.temp}°C</p>
            <p className="forecast-condition">{day.condition}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ForecastCard
