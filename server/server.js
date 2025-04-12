const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const weatherRoute = require('./routes/weather');
const forecastRoute = require('./routes/forecast');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/weather', weatherRoute);
app.use('/forecast', forecastRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
