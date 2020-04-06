# tinyhouse-masterclass

Based on [TinyHouse: A Fullstack React Masterclass with TypeScript and GraphQL](https://www.newline.co/tinyhouse)

## Server

A [TypeScript](https://www.typescriptlang.org) based [Express](https://expressjs.com) server which exposes a single [GraphQL](https://graphql.org) endpoint using [Apollo](https://www.apollographql.com) to query and delete listings from a [cloud DBaaS for MongoDB](https://cloud.mongodb.com)

For more information, see the [README](server/README.md) file of the server.

## Client

A [TypeScript](https://www.typescriptlang.org) based [React](https://reactjs.org) application generated with [CRA](https://github.com/facebook/create-react-app) and styled with [Ant Design](https://ant.design) which uses [GraphQL](https://graphql.org) and the custom hooks of [Apollo](https://www.apollographql.com) to fetch and delete listings through the server.

For more information, see the [README](client/README.md) file of the client.
