import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type Viewer {
        id: ID
        token: String
        avatar: String
        hasWallet: Boolean
        didRequest: Boolean!
    }

    input LogInInput {
        code: String!
    }

    type Listing {
        id: ID!
        address: String!
        favorite: Boolean!
        image: String!
        numOfBaths: Int!
        numOfBeds: Int!
        numOfBookings: Int!
        numOfGuests: Int!
        price: Int!
        rating: Float!
        title: String!
    }

    type Booking {
        id: ID!
        title: String!
        image: String!
        address: String!
        timestamp: String!
    }

    type Query {
        authUrl: String!
        bookings: [Booking!]!
        listings: [Listing!]!
    }

    type Mutation {
        logIn(input: LogInInput): Viewer!
        logOut: Viewer!
        createBooking(id: ID!, timestamp: String!): Booking!
        deleteListing(id: ID!): Listing!
        favoriteListing(id: ID!): Listing!
    }
`;
