require('dotenv').config();
import { Collection } from 'mongodb';

import { connectDatabase } from '../src/database';

const log = (...args: string[]) => {
    console.log('[clear]:', ...args);
};

const deleteCollection = async (name: string, collection: Collection) => {
    const results = await collection.find({}).toArray();
    if (results.length > 0) {
        await collection.drop();
        log(`Documents of "${name}" collection have been cleared ...`);
    }
};

(async () => {
    try {
        log('Connecting to the database ...');
        const db = await connectDatabase();
        const deletionPromises = Object.entries(db).map(([key, collection]: [string, Collection]) => deleteCollection(key, collection));
        await Promise.all(deletionPromises);
        log('Done');
        process.exit(0);
    } catch (err) {
        console.log(err);
        throw new Error('Failed to clear database');
    }
})();
