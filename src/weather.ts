import axios from "axios";
import {utcToZonedTime} from 'date-fns-tz';

import locations from './disneyLocations.json';

const apiKey = 'af79d4b39a7b47b9b44175548230912';

interface WeatherResult {
    temperature: number;
    conditions: number;
    time: number;
}

async function getWeather(latitude: number, longitude: number): Promise<WeatherResult> {
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&units=imperial`;

    try {
        const response = await axios.get(apiUrl);
        const { current } = response.data;
        const temperature = current.temp_f;
        const conditions = current.condition.code;

        const tzString = response.data.location.tz_id;

        const currentTime = utcToZonedTime(new Date(), tzString);
        const time = Math.trunc(currentTime.getTime() / 1000); // convert millis to seconds


        return { temperature, conditions, time };
    } catch (error) {
        throw new Error(`Error fetching data from weatherapi.com: ${error.message}`);
    }
}

const getAllWeathers = async () => {
    const weathers = await Promise.all(locations.map(async (location) => {
        const { city, latitude, longitude } = location;
        const result = await getWeather(latitude, longitude);
        return {city, ...result};
    }));
    return weathers;
}

export default getAllWeathers;

