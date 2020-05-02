# tinyhouse-masterclass

Based on [TinyHouse: A Fullstack React Masterclass with TypeScript and GraphQL](https://www.newline.co/tinyhouse)

## Server

A [TypeScript](https://www.typescriptlang.org) based [Express](https://expressjs.com) server which exposes a single [GraphQL](https://graphql.org) endpoint using [Apollo](https://www.apollographql.com) to query and delete listings from a [cloud DBaaS for MongoDB](https://cloud.mongodb.com)

For more information, see the [README](server/README.md) file of the server.

## Client

A [TypeScript](https://www.typescriptlang.org) based [React](https://reactjs.org) application generated with [CRA](https://github.com/facebook/create-react-app) and styled with [Ant Design](https://ant.design) which uses [GraphQL](https://graphql.org) and the custom hooks of [Apollo](https://www.apollographql.com) to fetch and delete listings through the server.

For more information, see the [README](client/README.md) file of the client.

## Docker

```sh
# Create docker image
docker build -t tinyhouse .

# Run docker image locally
docker run -d -p 3000:3000 --env-file server/.env tinyhouse
```

## Deployment

Deployed application: https://tinyhouse-app-demo.herokuapp.com

### Steps

```sh
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login to Heroku
heroku login

# Sign into Container Registry
heroku container:login

# Push the docker image into the container registry
heroku container:push web -a [app_name]

# Deploy the changes
heroku container:release web -a [app_name]

# Configure environment variables on the application page at Heroku based on your local .env.production file

# Set the PUBLIC_URL accordingly based on the generated application hostname

# Change redirect URI for Google OAuth at Google Developers Console or use separate credentials for PROD when setting up the environment variables

# Change redirect URI for Stripe OAuth at Stripe Dashboard or use separate credentials for PROD when setting up the environment variables
```

## Additional features to implement

### Rate a listing

-   Users should be able to rate a listing with stars between 1-5 that they booked at least once
-   Users cannot rate a listing more than once
-   Average rating should be displayed on the listing card

### Delete listing

-   Users should be able to delete their own listing
-   A deleted listing should not be returned by a search
-   When navigating to the view page of a given listing which had been deleted already then a message should be displayed
-   Users should not be able to book a deleted listing

### Favorite listings

-   Users should be able to favorite/unfavorite listings
-   Favorite listings should appear on the user's profile page in a paginated fashion
-   Users should not be able to see each others' favorites
