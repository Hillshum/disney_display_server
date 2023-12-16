import axios from "axios";
import {utcToZonedTime} from 'date-fns-tz';
import Cache from "./parkCache";

import locations from './disneyLocations.json';

const apiKey = 'af79d4b39a7b47b9b44175548230912';

interface Location {
    city: string;
    latitude: number;
    longitude: number;
}
interface WeatherResult {
    temperature: number;
    conditions: number;
    time: number;
}

interface WeatherCacheEntry {
    temperature: number;
    conditions: number;
    tzString: string;
}

const weatherCache = new Cache<WeatherCacheEntry>(60 * 5);

async function getWeatherFromApi(latitude: number, longitude: number): Promise<WeatherCacheEntry> {
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&units=imperial`;
    try {

        console.log(`fetching data from ${apiUrl}`)
        const response = await axios.get(apiUrl);
        return {
            temperature: response.data.current.temp_f,
            conditions: response.data.current.condition.code,
            tzString: response.data.location.tz_id,
        };

    } catch (error) {
        throw new Error(`Error fetching data from weatherapi.com: ${error.message}`);
    }
}

async function getWeather(location: Location): Promise<WeatherResult> {

    let weather = weatherCache.get(location.city);

    if (!weather) {
        console.log(`cache miss on ${location.city}`)
        weather = await getWeatherFromApi(location.latitude, location.longitude)
        weatherCache.set(location.city, weather);
    }

    const currentTime = utcToZonedTime(new Date(), weather.tzString);
    const time = Math.trunc(currentTime.getTime() / 1000); // convert millis to seconds


    return { temperature: weather.temperature, conditions: weather.conditions, time };
}

const getAllWeathers = async () => {
    const weathers = await Promise.all(locations.map(async (location) => {
        const { city } = location;
        const result = await getWeather(location);
        return {city, ...result};
    }));
    return weathers;
}

const warmCache = () => {
    console.log('warming cache');
    locations.forEach((location) => {
        getWeather(location);
    });
}

if (process.env.USE_CACHEWARMER) {
    warmCache();
    setInterval(warmCache, 30 * 1000);
}

export default getAllWeathers;

