import express from 'express';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';

import { connectDatabase } from './database';
import { resolvers, typeDefs } from './graphql';
import { Configuration } from './config';

const { API_PREFIX, SECRET } = Configuration;

export const init = async () => {
    const app = express();

    app.use(cookieParser(SECRET));

    const db = await connectDatabase();

    const server = new ApolloServer({ resolvers, typeDefs, context: ({ req, res }) => ({ db, req, res }) });
    server.applyMiddleware({ app, path: API_PREFIX });

    return app;
};
