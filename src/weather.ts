import axios from "axios";
import {utcToZonedTime} from 'date-fns-tz';
import Cache from "./parkCache.js";
import { WEATHER_API_KEY } from "./config.js";
import { isRejected, isFullfilled } from "./utils.js";

import locations from './disneyLocations.json' with { type: "json" };

const apiKey = WEATHER_API_KEY;
if (!apiKey) {
    throw new Error('No weather api key found');
}

interface Location {
    city: string;
    latitude: number;
    longitude: number;
}
interface WeatherResult {
    temperature: number;
    conditions: number;
    time: number;
    isDay: boolean;
}

interface WeatherCacheEntry {
    temperature: number;
    conditions: number;
    tzString: string;
    isDay: boolean;
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
            isDay: !!response.data.current.is_day
        };

    } catch (error) {
        throw new Error(`Error fetching data from weatherapi.com: ${error}`); // TODO get better error message
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


    return { temperature: weather.temperature, conditions: weather.conditions, time, isDay: weather.isDay };
}

const getAllWeathers = async () => {
    const weatherResults = await Promise.allSettled(locations.map(async (location) => {
        const { city } = location;
        const result = await getWeather(location);
        return {city, ...result};
    }));

    const weathers = weatherResults.filter(isFullfilled).map((p) => p.value);
    weatherResults.filter(isRejected).forEach((r) => console.warn(`failed to fetch data: ${r.reason}`));
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

