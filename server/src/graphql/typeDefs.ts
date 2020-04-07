import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type Listing {
        id: ID!
        title: String!
        image: String!
        address: String!
        price: Int!
        numOfGuests: Int!
        numOfBeds: Int!
        numOfBaths: Int!
        rating: Int!
        bookings: [ID!]!
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
    }
`;
