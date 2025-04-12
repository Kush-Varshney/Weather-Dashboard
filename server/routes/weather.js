const express = require("express");
const axios = require("axios");
const router = express.Router();
const API_KEY = process.env.OPENWEATHER_API_KEY;

router.get("/", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City parameter is required" });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = response.data;

    const weather = {
      city: data.name,
      temp: data.main.temp,
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };

    res.json(weather);
  } catch (err) {
    console.error("OpenWeather Error:", err.response?.data || err.message);
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "City not found. Please check the spelling and try again." });
    }
    res.status(500).json({ error: "Failed to fetch weather data. Please try again later." });
  }
});

module.exports = router;
