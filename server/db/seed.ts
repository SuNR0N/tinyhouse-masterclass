require('dotenv').config();
import { ObjectId } from 'mongodb';

import listings from './json/listings.json';
import users from './json/users.json';

import { connectDatabase } from '../src/database';
import { Database, ListingType } from '../src/types';

const log = (...args: string[]) => {
    console.log('[seed]:', ...args);
};

const seedUsers = async (db: Database) => {
    const userEntities = users.map((user) => ({
        ...user,
        listings: user.listings.map((listingId) => new ObjectId(listingId)),
    }));
    await db.users.insertMany(userEntities);
    log(`Collection "users" have been seeded ...`);
};

const seedListings = async (db: Database) => {
    const listingEntities = listings.map((listing) => ({
        ...listing,
        _id: new ObjectId(listing._id),
        type: listing.type as ListingType,
    }));
    await db.listings.insertMany(listingEntities);
    log(`Collection "listings" have been seeded ...`);
};

(async () => {
    try {
        log('Connecting to the database ...');
        const db = await connectDatabase();
        log('Initialising database with mocked data ...');
        await seedUsers(db);
        await seedListings(db);
        log('Done');
        process.exit(0);
    } catch {
        throw new Error('Failed to seed database');
    }
})();
