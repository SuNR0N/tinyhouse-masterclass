import { gql } from 'apollo-server-express';

export const typeDefs = gql`
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
        bookings: [Booking!]!
        listings: [Listing!]!
    }

    type Mutation {
        createBooking(id: ID!, timestamp: String!): Booking!
        deleteListing(id: ID!): Listing!
        favoriteListing(id: ID!): Listing!
    }
`;
