import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import { resolvers, typeDefs } from './graphql';
import { Configuration } from './config';

const { API_PREFIX, ENVIRONMENT, PORT } = Configuration;

const app = express();
const server = new ApolloServer({ resolvers, typeDefs });
server.applyMiddleware({ app, path: API_PREFIX });

app.listen(PORT, () => {
    console.info(`Server is running at http://localhost:${PORT} in mode "${ENVIRONMENT}"`);
});
