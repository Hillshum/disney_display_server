import axios from 'axios';

// Define the parks and rides you want to retrieve wait times for
const parksAndRides = [
  { park: 'Disneyland', ride: 'Space Mountain' },
  { park: 'Universal Studios', ride: 'Harry Potter and the Forbidden Journey' },
  // Add more parks and rides as needed
];

const getWaitTimes = async () => {
  try {
    const waitTimes = await Promise.all(
      parksAndRides.map(async (parkAndRide) => {
        const { park, ride } = parkAndRide;
        const response = await axios.get(
          `https://queue-times.com/parks/${encodeURIComponent(park)}/rides/${encodeURIComponent(ride)}`
        );
        return {
          park,
          ride,
          waitTime: response.data.waitTime,
        };
      })
    );
    return waitTimes;
  } catch (error) {
    console.error('Error retrieving wait times:', error);
    return [];
  }
};

export default getWaitTimes;

// Usage example
// getWaitTimes().then((waitTimes) => {
//   console.log(waitTimes);
// });