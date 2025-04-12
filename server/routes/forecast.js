const express = require("express");
const axios = require("axios");
const router = express.Router();
const API_KEY = process.env.OPENWEATHER_API_KEY;

router.get("/", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City parameter is required" });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    const forecastData = response.data.list
      .filter((item) => item.dt_txt.includes("12:00:00"))
      .slice(0, 5);

    const forecast = forecastData.map((item) => ({
      date: new Date(item.dt_txt).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      icon: item.weather[0].icon,
    }));

    res.json(forecast);
  } catch (err) {
    console.error("OpenWeather Forecast Error:", err.response?.data || err.message);
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "City not found. Please check the spelling and try again." });
    }
    res.status(500).json({ error: "Failed to fetch forecast data. Please try again later." });
  }
});

module.exports = router;
