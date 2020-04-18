import { IResolvers } from 'apollo-server-express';
// import { ObjectId } from 'mongodb';

import { Database, Booking } from '../../../models';

export const bookingResolvers: IResolvers = {
    Query: {
        bookings: async (_root: undefined, _args: {}, { db }: { db: Database }) => {
            return await db.bookings.find({}).toArray();
        },
    },
    Mutation: {
        // TODO: Make it work again
        // createBooking: async (_root: undefined, { id, timestamp }: { id: string; timestamp: string }, { db }: { db: Database }) => {
        //     const listing = await db.listings.findOne({ _id: new ObjectId(id) });
        //     if (!listing) {
        //         throw new Error(`Failed to fetch listing with id: ${id}`);
        //     }
        //     const newBooking: Booking = {
        //         _id: new ObjectId(),
        //         listing: listing._id,
        //         checkIn: timestamp,
        //         checkOut: timestamp,
        //         tenant: '',
        //     };
        //     const { insertedId } = await db.bookings.insertOne(newBooking);
        //     if (!insertedId) {
        //         throw new Error('Failed to create new booking');
        //     }
        //     return newBooking;
        // },
    },
    Booking: {
        id: (booking: Booking) => booking._id.toString(),
        listing: async (booking: Booking, _args: {}, { db }: { db: Database }) => {
            return await db.listings.findOne({ _id: booking.listing });
        },
    },
};
