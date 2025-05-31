import Weather from "./Weather";

const Country = ({ country }) => {
  const languages = Object.values(country.languages);
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width={200}
      ></img>
      <Weather country={country}></Weather>
    </div>
  );
};

const CountryList = ({ countries, showCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify filter.</p>;
  }

  if (countries.length === 1) {
    return <Country country={countries[0]}></Country>;
  }
  return (
    <div>
      {countries.map((c) => (
        <div key={c.cca3}>
          {c.name.common}{" "}
          <button onClick={() => showCountry(c.name.common)}>show</button>
        </div>
      ))}
    </div>
  );
};

export default CountryList;
