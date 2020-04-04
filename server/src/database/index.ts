import { MongoClient } from 'mongodb';

import { Configuration } from '../config';
import { Database } from '../models/database';

const { DB_CLUSTER, DB_COLLECTION_NAME, DB_PASSWORD, DB_USER, DB_NAME } = Configuration;
const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/test?retryWrites=true&w=majority`;

export const connectDatabase = async (): Promise<Database> => {
    const client = await MongoClient.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db(DB_NAME);

    return {
        listings: db.collection(DB_COLLECTION_NAME),
    };
};
