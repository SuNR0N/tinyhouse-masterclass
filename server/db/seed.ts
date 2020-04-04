require('dotenv').config();
import { ObjectId } from 'mongodb';

import listings from './json/listings.json';
import { connectDatabase } from '../src/database';
import { Listing } from '../src/models/listing';

const log = (...args: string[]) => {
    console.log('[seed]:', ...args);
};

(async () => {
    try {
        log('Connecting to the database ...');
        const db = await connectDatabase();
        log('Removing documents from listings collection ...');
        await db.listings.deleteMany({});
        log('Initialising database with mocked data ...');
        const promises = listings.map((listing: Omit<Listing, '_id'>) =>
            db.listings.insertOne({
                ...listing,
                _id: new ObjectId(),
            })
        );
        await Promise.all(promises);
        log('Done');
        process.exit(0);
    } catch {
        throw new Error('Failed to seed database');
    }
})();
