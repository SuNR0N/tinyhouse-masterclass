## Prerequisites

### MongoDB

Create _bookings_,_listings_ and _users_ collections under a namespace within [MongoDB Atlas](https://cloud.mongodb.com)

### Google

-   Create a new project called _TinyHouse_ in [Google Developers Console](https://console.developers.google.com)
-   Enable the _Google People API_ from the _Library_ menu
-   Enable the _Geocoding API_ from the _Library_ menu
-   Create an _OAuth client ID_ for your web application by clicking the _Create Credentials_ button on the _Credentials_ page
-   Set up your redirect URI for OAuth under the newly created Client ID
-   Create an _API key_ by clicking the _Create Credentials_ button on the _Credentials_ page and restrict its usage to the _Geocoding API_
-   Enable _Billing_ (and use the free trial credit if you have) in order to use the _Geocoding API_

### Stripe

-   Create a new account called _TinyHouse_ in [Stripe Dashboard](https://dashboard.stripe.com/dashboard)
-   Turn on the _Viewing test data_ switch
-   Navigate to the _Connect Settings_ under the _Settings_ menu
    -   Set the redirect URI within the _Integration_ section
    -   Retrieve the _Test mode client ID_ from the _Integration_ section
    -   Set up your own branding in the _Branding_ section
-   Navigate to the _API keys_ menu under _Developers_
    -   Retrieve your _Publishable key_
    -   Retrieve your _Secret key_

### Cloudinary

Register to [Cloudinary](https://cloudinary.com) and retrieve the following properties of your _Account Details_ from the _Dashboard_:

-   _Cloud name_
-   _API Key_
-   _API Secret_

### Environment variables

Create a `.env` file as follows:

```sh
# Cloud name in Cloudinary which can be found in the Account Details section of the Cloudinary Dashboard
CLOUDINARY_CLOUD_NAME=*****

# API Key in Cloudinary which can be found in the Account Details section of the Cloudinary Dashboard
CLOUDINARY_API_KEY=*****

# API Secret in Cloudinary which can be found in the Account Details section of the Cloudinary Dashboard
CLOUDINARY_API_SECRET=*****

# MongoDB cluster name which can be retrieved from the connection string when clicking the Connect button on the Clusters page
DB_CLUSTER=cluster*****

# Key value pairs for your collections if you intend to create them with different names
DB_COLLECTIONS=listings=listings,bookings=bookings,users=users

# The namespace under your collections can be found in MongoDB
DB_NAME=main

# DB password
DB_PASSWORD=*****

# DB username
DB_USER=*****

# Client ID for Google OAuth 2.0 which can be found in the Credentials section of your registered TinyHouse project in your Google Developers Console
GOOGLE_CLIENT_ID=*****

# Client secret for Google OAuth 2.0 which can be found in the Credentials section of your registered TinyHouse project in your Google Developers Console
GOOGLE_CLIENT_SECRET=*****

# API key for Google Geocoding API which can be found in the Credentials section of your registered TinyHouse project in your Google Developers Console
GOOGLE_GEOCODE_KEY=*****

# Public URL of the application which is being used for redirects (Google OAuth)
PUBLIC_URL=http://localhost:3000

# Secret which is used to sign the cookies
SECRET=*****

# Client ID for Stripe OAuth 2.0 which can be found in the Integration section of Settings/Connect Settings on the Stripe Dashboard
STRIPE_CLIENT_ID=ca_*****

# Client secret for Stripe OAuth 2.0 which can be found in the Integration section of Settings/Connect Settings on the Stripe Dashboard
STRIPE_SECRET_KEY=sk_test_*****

# The port on which the application starts (defaults to 3000)
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

### `npm run db:clear`

Clears the configured data collections in _MongoDB_.

### `npm run db:seed`

Initialises the configured data collections with a
mocked data set using [listings.json](db/json/listings.json) and [users.json](db/json/users.json) respectively.

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
