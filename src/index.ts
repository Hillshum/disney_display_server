import axios from 'axios';
import express from 'express';
import getAllWeathers from './weather';
import {getWaitsForResortById, getWaitsForRandomResort} from './queues';

const app = express();
const port = process.env.PORT || 3000;

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
        const waitTimes = await getWaitsForRandomResort();
        res.json(waitTimes);
    } catch (error) {
        next(error)
    }
})

app.get('/waitTimes/:resortId', async (req, res, next) => {
    try {
        const waitTimes = await getWaitsForResortById(req.params.resortId);
        res.json(waitTimes);
    } catch (error) {
        next(error)
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
