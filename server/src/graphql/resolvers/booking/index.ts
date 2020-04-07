import { IResolvers } from 'apollo-server-express';
import { ObjectId } from 'mongodb';

import { Database, Booking } from '../../../models';

export const bookingResolvers: IResolvers = {
    Query: {
        bookings: async (_root: undefined, _args: {}, { db }: { db: Database }) => {
            return await db.bookings.find({}).toArray();
        },
    },
    Mutation: {
        createBooking: async (_root: undefined, { id, timestamp }: { id: string; timestamp: string }, { db }: { db: Database }) => {
            const listing = await db.listings.findOne({ _id: new ObjectId(id) });

            if (!listing) {
                throw new Error(`Failed to fetch listing with id: ${id}`);
            }

            const newBooking: Booking = {
                _id: new ObjectId(),
                address: listing.address,
                image: listing.image,
                title: listing.title,
                timestamp,
            };
            const { insertedId } = await db.bookings.insertOne(newBooking);

            if (!insertedId) {
                throw new Error('Failed to create new booking');
            }

            const { modifiedCount } = await db.listings.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        bookings: [...listing.bookings, insertedId],
                    },
                }
            );

            if (modifiedCount === 0) {
                throw new Error(`Failed to update listing (id: ${id}) with booking (id: ${newBooking._id.toHexString()})`);
            }

            return newBooking;
        },
        deleteListing: async (_root: undefined, { id }: { id: string }, { db }: { db: Database }) => {
            const { value } = await db.listings.findOneAndDelete({
                _id: new ObjectId(id),
            });

            if (!value) {
                throw new Error(`Failed to delete listing with id: ${id}`);
            }

            return value;
        },
    },
    Booking: {
        id: (booking: Booking) => booking._id.toHexString(),
    },
};
