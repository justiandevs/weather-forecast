import './index.css';
import {useEffect, useState} from "react";
import {fetchPlace} from "./utils/fetchPlace";

export default function App() {
    const [city, setCity] = useState("");
    const [finalCity, setFinalCity] = useState("");
    const [autocompleteCities, setAutocompleteCities] = useState([]);
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${finalCity}&appid=${process.env.REACT_APP_API_KEY}`);
            const res = await data.json();
            setData(res);
        }

        if(finalCity !== "") {
            fetchData()
                .catch(console.error());
        }
    }, [finalCity])

    const handleCityChange = async (e) => {
        setCity(e.target.value);
        if (!city) return;

        const res = await fetchPlace(city);
        !autocompleteCities.includes(e.target.value) &&
        res.features &&
        setAutocompleteCities(res.features.map((place) => place.place_name));
    };

    const handleSubmit = event => {
        event.preventDefault();
        setFinalCity(city.split(",")[0]);
        setCity("");
    };

    return (
        <div className="mt-24">
            <h1 className="text-4xl text-purple-700 font-bold">
                What is your hotness
            </h1>
            {!finalCity ? (
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="city" className="label">
                                Your city
                            </label>
                            <input
                                list="places"
                                type="text"
                                id="city"
                                name="city"
                                onChange={handleCityChange}
                                value={city}
                                required
                                pattern={autocompleteCities.join("|")}
                                autoComplete="off"
                                className={"px-4 py-3 rounded-lg"}
                            />
                            <datalist id="places">
                                {autocompleteCities.map((city, i) => (
                                    <option key={i}>{city}</option>
                                ))}
                            </datalist>
                            <button type="submit" className="rounded-lg bg-purple-700 text-purple-100 py-4 mt-2 transition duration-200 hover:bg-purple-600">Submit</button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="flex flex-col gap-2 mt-4 items-center justify-center">
                    {data &&
                        <div className="flex flex-row gap-4 items-center justify-center">
                            <img src={`/images/${data?.weather?.[0]?.main}.svg`} alt="weather icon"/>
                            <h2 className="text-7xl">
                                {Math.round(data?.main?.temp - 273.15)}°
                            </h2>
                        </div>
                    }
                    <button onClick={() => setFinalCity("")} className="w-full rounded-lg bg-purple-700 text-purple-100 py-4 mt-2 transition duration-200 hover:bg-purple-600">Clear city</button>
                </div>
            )}
        </div>
    )
}
