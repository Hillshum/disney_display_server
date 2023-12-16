import axios from 'axios';

import Cache from './parkCache';
import queueIds from './queueIds.json';

import {ParkIdData, ParkResponse, ResortIdData, ResortRidesData, RideResponse} from './queueTypes';

const CACHE_TTL_SECONDS = 60;

const parkCache = new Cache<RideResponse[]>(CACHE_TTL_SECONDS);


const getRidesForPark = (park: ParkResponse) => {
    const rides: RideResponse[] = [];
    park.lands.forEach((land) => {
        land.rides.forEach((ride) => {
            rides.push(ride);
        });
    });
    return [...rides, ...park.rides];
}


const getWaitTimesForPark = async (park: ParkIdData) => {
    const url = `https://queue-times.com/parks/${park.id}/queue_times.json`;
    let chosenRides = parkCache.get(url);
    if (!chosenRides) {
        console.log(`fetching data from ${url}`)
        const response = await axios.get<ParkResponse>(url);
        const availableRides = getRidesForPark(response.data);
        chosenRides = park.rides.map((r) => {
            return availableRides.find((ride) => ride.id === r.id);
        })
        parkCache.set(url, chosenRides);
    }
    return chosenRides
};

const getWaitsForResort = async (resort: ResortIdData): Promise<ResortRidesData> => {
    const parkRides = await Promise.all(resort.parks.map(async (park) => getWaitTimesForPark(park)))
    const flatRides = parkRides.flat();
    return {name: resort.name, id: resort.id, rides: flatRides};
}

const getWaitsForRandomResort = async (previousResortId: string = ""): Promise<ResortRidesData> => {
    const allResorts = await Promise.all(queueIds.map(async (resort) => (await getWaitsForResort(resort))));
    const open = getOpenResorts(allResorts);

    if (open.length === 1) {
        console.log('only one resort open')
        return open[0]
    }

    const differentResorts = open.filter((resort) => resort.id !== previousResortId.toUpperCase());
    // get a random number between 0 and the number of open resorts
    const randomIndex = Math.floor(Math.random() * differentResorts.length);
    return differentResorts[randomIndex];
}

const getWaitsForResortById = async (resortId: string): Promise<ResortRidesData> => {
    const uppered = resortId.toUpperCase();
    const resort = queueIds.find((r) => r.id === uppered);
    return getWaitsForResort(resort);
}


const isResortOpen = (resort: ResortRidesData) => {
    return resort.rides.some((ride) => ride.is_open);
}

const getOpenResorts = (resorts: ResortRidesData[]) => {
    return resorts.filter((resort) => isResortOpen(resort));
}


const cacheWarmer = () => {
    console.log('warming cache for parks')
    const parks = queueIds.flatMap((resort) => resort.parks);
    parks.forEach((park) => getWaitTimesForPark(park))
}

if (process.env.USE_CACHEWARMER ) {
    cacheWarmer();
    setInterval(cacheWarmer, 30 * 1000);
}

export  {getWaitsForResortById, getWaitsForRandomResort};
