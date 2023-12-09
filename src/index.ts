import axios from 'axios';
import express from 'express';
import weather from './weather';
import getWaitTimes from './queues';
import locations from './disneyLocations.json';

const app = express();
const port = 3000;
const getAllWeathers = async () => {
    const weathers = await Promise.all(locations.map(async (location) => {
        const { latitude, longitude } = location;
        const result = await weather(latitude, longitude);
        return result;
    }));
    return weathers;
}

app.get('/getWeathers', async (req, res) => {
    try {
        const weathers = await getAllWeathers();
        res.json(weathers);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/waitTimes', async (req, res, next) => {
    try {
        const waitTimes = await getWaitTimes();
        res.json(waitTimes);
    } catch (error) {
        next(error)
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
