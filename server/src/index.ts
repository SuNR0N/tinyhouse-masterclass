import express from 'express';
import bodyParser from 'body-parser';

import { Configuration } from './config';
import { listings } from './listings';

const { ENVIRONMENT, PORT } = Configuration;

const app = express();

app.use(bodyParser.json());

// listings
app.get('/listings', (_req, res) => {
    return res.send(listings);
});

// delete listing
app.delete('/listings/:id', (req, res) => {
    const idToDelete: string = req.params.id;
    const indexToDelete = listings.findIndex(({ id }) => id === idToDelete);
    if (indexToDelete > -1) {
        const [deletedListing] = listings.splice(indexToDelete, 1);
        res.send(deletedListing);
    } else {
        res.status(404).end();
    }
});

app.listen(PORT, () => {
    console.info(`Server is running at http://localhost:${PORT} in mode "${ENVIRONMENT}"`);
});
