import { readFileSync } from 'fs';

const secret = readFileSync('/run/secrets/weather_api', 'utf8').trim();

export const WEATHER_API_KEY = secret ?? process.env.WEATHER_API_KEY ?? '';