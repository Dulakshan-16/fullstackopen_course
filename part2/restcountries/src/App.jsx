import { useEffect, useState } from "react";
import axios from "axios";
import CountryList from "./components/CountryList";

const COUNTRY_API_URL = "https://studies.cs.helsinki.fi/restcountries/";

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get(`${COUNTRY_API_URL}/api/all`).then((response) => {
      setCountries(response.data);
    });
  }, []);

  const matchedCountries = countries.filter((c) =>
    c.name.common.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div>
        find countries{" "}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
      </div>
      <CountryList
        countries={matchedCountries}
        showCountry={setSearch}
      ></CountryList>
    </>
  );
};

export default App;
