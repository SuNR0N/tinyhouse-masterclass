require('dotenv').config();
import { ObjectId, Collection } from 'mongodb';

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
        const deletionPromises = Object.entries(db).map(async ([key, collection]: [string, Collection]) => {
            log(`Removing documents from "${key}" collection ...`);
            const result = await collection.deleteMany({});
            log(`Collection "${key}" has been cleared ...`);
            return result;
        });
        await Promise.all(deletionPromises);
        log('Initialising database with mocked data ...');
        const insertionPromises = listings.map((listing: Omit<Listing, '_id' | 'bookings'>) =>
            db.listings.insertOne({
                ...listing,
                _id: new ObjectId(),
                bookings: [],
            })
        );
        await Promise.all(insertionPromises);
        log('Done');
        process.exit(0);
    } catch {
        throw new Error('Failed to seed database');
    }
})();
