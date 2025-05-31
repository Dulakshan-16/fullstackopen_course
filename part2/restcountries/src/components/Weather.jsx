import { useEffect, useState } from "react";
import axios from "axios";

const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const WEATHER_API_KEY = import.meta.env.WEATHER_API_KEY;

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null);

  const [lat, lon] = country.latlng;

  useEffect(() => {
    axios
      .get(
        `${WEATHER_API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
      )
      .then((response) => {
        console.log(response.data);
        setWeather(response.data);
      });
  }, []);

  if (!weather) {
    return null;
  }

  const iconId = weather.weather[0].icon;

  const weatherIcon = `https://openweathermap.org/img/wn/${iconId}@2x.png`;

  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      <p>Temperature {weather.main.temp} Celsius</p>
      <img src={weatherIcon} alt={weather.weather.main} />
      <p>Wind {weather.wind.speed} m/s</p>
    </div>
  );
};

export default Weather;
