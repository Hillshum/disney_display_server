
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

export {RideIdData, ParkIdData, ResortIdData, RideResponse, LandResponse, ParkResponse, ResortRidesData}