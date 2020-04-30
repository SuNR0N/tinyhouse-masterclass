## Prerequisites

1. Create _bookings_ and _listings_ collections under a namespace within [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a `.env` file as follows:

```sh
DB_CLUSTER=XXXX
DB_COLLECTIONS=bookings=test_bookings,listings=test_listings
DB_NAME=main
DB_PASSWORD=XXXX
DB_USER=XXXX
# PORT=3001
```

## Available Scripts

In the project directory, you can run:

### `npm run build`

Transpiles the source code into the _build_ directory.

### `npm run lint`

Runs the linter against the source code.

### `npm run lint:fix`

Runs the linter against the source code with an attempt to resolve any problems
which can be automatically fixed.

### `npm run seed`

Clears the configured data collection in _MongoDB_ and initialises it with a
mocked data set using [listings.json](db/json/listings.json).

### `npm start`

Runs the server in development mode at http://localhost:9000/api while watching the
source files for any changes.

### `npm test`

Runs unit test suites with coverage report for the source code.

## Learn More

-   Apollo - https://www.apollographql.com
-   Express - https://expressjs.com
-   GraphQL - https://graphql.org
-   MogodDB Atlas - https://www.mongodb.com/cloud/atlas
-   MongoDB - https://www.mongodb.com
-   Node.js - https://nodejs.org
-   TypeScript - https://www.typescriptlang.org

## TODO

-   [ ] -   Add unit tests
-   [ ] -   Add dockerized MongoDB
-   [ ] -   Update README
