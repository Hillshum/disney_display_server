import axios from 'axios';
import queueIds from './queueIds.json';

interface RideIdData {
    name: string;
    id: number;

}
interface ParkIdData {
    name: string;
    id: number;
    rides: RideIdData[];

}

interface ResortIdData {
    name: string;
    id: string;
    parks: ParkIdData[];
}


interface RideResponse {
    id: number;
    name: string;
    is_open: boolean;
    wait_time: number;
    last_updated: string;
}

interface LandResponse {
    id: number;
    name: string;
    rides: RideResponse[];
}

interface ParkResponse {
    id: number;
    name: string;
    lands: LandResponse[];
    rides: RideResponse[];
}

interface ResortRidesData{
    name: string;
    id: string;
    rides: RideResponse[];
}

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
    console.log(url)
    const response = await axios.get<ParkResponse>(url);
    const availableRides = getRidesForPark(response.data);

    const chosenRides = park.rides.map((r) => {
        return availableRides.find((ride) => ride.id === r.id);
    })
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

    if (open.length === 0) {
        return open[0]
    }

    const differentResorts = open.filter((resort) => resort.id !== previousResortId.toUpperCase());
    // get a random number between 0 and the number of open resorts
    const randomIndex = Math.floor(Math.random() * open.length);

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
export  {getWaitsForResortById, getWaitsForRandomResort};
