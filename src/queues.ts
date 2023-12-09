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

const getWaitTimes = async () => {
    return Promise.all(queueIds.map(async (park) => getWaitTimesForPark(park)));
}

export default getWaitTimes;

// Usage example
// getWaitTimes().then((waitTimes) => {
//   console.log(waitTimes);
// });