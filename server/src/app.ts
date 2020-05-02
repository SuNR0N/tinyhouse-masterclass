import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { ApolloServer } from 'apollo-server-express';

import { connectDatabase } from './database';
import { resolvers, typeDefs } from './graphql';
import { Configuration } from './config';

const { API_PREFIX, CLIENT_BUILD_DIR, REQUEST_BODY_LIMIT, SECRET } = Configuration;

export const init = async () => {
    const app = express();

    app.use(bodyParser.json({ limit: REQUEST_BODY_LIMIT }));
    app.use(cookieParser(SECRET));
    app.use(compression());

    app.use(express.static(CLIENT_BUILD_DIR));
    app.get('/*', (_req, res) => res.sendFile(`${CLIENT_BUILD_DIR}/index.html`));

    const db = await connectDatabase();

    const server = new ApolloServer({ resolvers, typeDefs, context: ({ req, res }) => ({ db, req, res }) });
    server.applyMiddleware({ app, path: API_PREFIX });

    return app;
};
