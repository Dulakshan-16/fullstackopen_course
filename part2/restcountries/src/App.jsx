import { useState, useEffect } from "react";
import axios from "axios";

const Filter = ({ filter, handleChange }) => {
	return (
		<>
			<p>
				find countries <input value={filter} onChange={handleChange}></input>
			</p>
		</>
	);
};

const CountryInfo = ({ country }) => {
	const api_key = import.meta.env.VITE_SOME_KEY;
	const [weatherData, setWeatherData] = useState(null);

	useEffect(() => {
		const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[1]}&appid=${api_key}`;

		axios
			.get(weatherURL)
			.then((response) => {
				setWeatherData(response.data);
			})
			.catch(() => {
				console.log("Could not load weather data.");
			});
	}, []);

	let languages = Object.values(country.languages);

	if (!weatherData) {
		return <p>Loading weather data...</p>;
	}

	const temperatue = (weatherData["main"]["temp"] - 273.15).toFixed(2);
	const weatherIconPath = `https://openweathermap.org/img/wn/${weatherData["weather"][0]["icon"]}@2x.png`;

	return (
		<div>
			<h3>{country.name.common}</h3>
			<p>capital {country.capital[0]}</p>
			<p>area {country.area}</p>
			<h4>languages</h4>
			<ul>
				{languages.map((language, index) => (
					<li key={index}>{language}</li>
				))}
			</ul>
			<img
				src={country.flags["png"]}
				alt={`Flag of ${country.name.common}`}
			></img>
			<h3>Weather in {country.capital[0]}</h3>
			{<p>temperature {temperatue} Celsius</p>}
			<img src={weatherIconPath}></img>
			<p>wind {weatherData["wind"]["speed"]} m/s</p>
		</div>
	);
};

const Countries = ({ filter, countries, showCountry }) => {
	if (filter == "" || countries === null) {
		return <>Type to filter countries.</>;
	}
	console.log(filter);

	let filteredCountries = [];

	filteredCountries = countries.filter((country) =>
		country.name.common.toLowerCase().includes(filter.toLowerCase())
	);

	if (filteredCountries.length > 10) {
		return <>Too many matches, specify another filter</>;
	}

	if (filteredCountries.length == 1) {
		return <CountryInfo country={filteredCountries[0]} />;
	}
	return (
		<div>
			{filteredCountries.map((country) => (
				<p key={country.ccn3}>
					{country.name.common}{" "}
					<button onClick={showCountry(country.name.common)}>show</button>
				</p>
			))}
		</div>
	);
};

function App() {
	const url = "https://studies.cs.helsinki.fi/restcountries/api/all";

	const [countries, setCountries] = useState(null);
	const [filter, setFilter] = useState("");

	useEffect(() => {
		axios.get(url).then((response) => setCountries(response.data));
	}, []);

	return (
		<div>
			<Filter
				countries={countries}
				filter={filter}
				handleChange={(e) => {
					setFilter(e.target.value);
				}}
			/>
			<Countries
				filter={filter}
				countries={countries}
				showCountry={(countryName) => () => setFilter(countryName)}
			/>
		</div>
	);
}

export default App;
