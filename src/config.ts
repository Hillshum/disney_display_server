import { readFileSync } from 'fs';


let secret: string | null = null;
try {
  secret = readFileSync("/run/secrets/weather_api", "utf8").trim();
} catch (err) {
  console.log("No weather api key found in /run/secrets/weather_api");
}

export const WEATHER_API_KEY = secret ?? process.env.WEATHER_API_KEY ?? '';