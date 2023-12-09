import axios from "axios";

const apiKey = 'af79d4b39a7b47b9b44175548230912';

interface WeatherResult {
    temperature: number;
    conditions: string;
    time: number;
}

async function getWeather(latitude: number, longitude: number): Promise<WeatherResult> {
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&units=imperial`;

    try {
        const response = await axios.get(apiUrl);
        const { current } = response.data;
        const temperature = current.temp_f;
        const conditions = current.condition.text;
        const time = response.data.location.localtime_epoch;


        return { temperature, conditions, time };
    } catch (error) {
        throw new Error(`Error fetching data from weatherapi.com: ${error.message}`);
    }
}

export default getWeather;

// // Example usage:
// const latitude = 37.7749; // Replace with your desired latitude
// const longitude = -122.4194; // Replace with your desired longitude

// getWeather(latitude, longitude)
//   .then(result => {
//     console.log(`Current temperature at (${latitude}, ${longitude}): ${result.temperature}°F`);
//     console.log(`Current conditions at (${latitude}, ${longitude}): ${result.conditions}`);
//   })
//   .catch(error => {
//     console.error(error.message);
//   });
