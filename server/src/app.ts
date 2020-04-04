import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import { connectDatabase } from './database';
import { resolvers, typeDefs } from './graphql';
import { Configuration } from './config';

export const init = async () => {
    const app = express();

    const db = await connectDatabase();

    const server = new ApolloServer({ resolvers, typeDefs, context: () => ({ db }) });
    server.applyMiddleware({ app, path: Configuration.API_PREFIX });

    return app;
};
