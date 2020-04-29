import { IResolvers } from 'apollo-server-express';
import { Request } from 'express';
import { ObjectId } from 'mongodb';

import { BookingsIndex, Database, Booking } from '../../../types';
import { CreateBookingsArgs } from './types';
import { authorize } from '../../../utils';
import { Stripe } from '../../../api/stripe';

const MILLISECONDS_PER_DAY = 60 * 60 * 24 * 1000;
const MAX_DAYS_AHEAD = 90;

const resolveBookingsIndex = (bookingsIndex: BookingsIndex, checkInDate: string, checkOutDate: string) => {
    const checkOut = new Date(checkOutDate);
    const newBookingsIndex: BookingsIndex = { ...bookingsIndex };

    let dateCursor = new Date(checkInDate);

    while (dateCursor <= checkOut) {
        const year = dateCursor.getUTCFullYear();
        const month = dateCursor.getUTCMonth();
        const day = dateCursor.getUTCDate();

        if (!newBookingsIndex[year]) {
            newBookingsIndex[year] = {};
        }

        if (!newBookingsIndex[year][month]) {
            newBookingsIndex[year][month] = {};
        }

        if (!newBookingsIndex[year][month][day]) {
            newBookingsIndex[year][month][day] = true;
        } else {
            throw new Error("Selected dates can't overlap dates that have already been booked");
        }

        dateCursor = new Date(dateCursor.getTime() + MILLISECONDS_PER_DAY);
    }

    return newBookingsIndex;
};

export const bookingResolvers: IResolvers = {
    Query: {
        bookings: async (_root: undefined, _args: {}, { db }: { db: Database }) => {
            return await db.bookings.find({}).toArray();
        },
    },
    Mutation: {
        createBooking: async (_root: undefined, { input }: CreateBookingsArgs, { db, req }: { db: Database; req: Request }) => {
            try {
                const { checkIn, checkOut, id, source } = input;

                const viewer = await authorize(db, req);
                if (!viewer) {
                    throw new Error('Viewer cannot be found');
                }

                const listing = await db.listings.findOne({ _id: new ObjectId(id) });
                if (!listing) {
                    throw new Error(`Listing with id "${id}" cannot be found`);
                }

                if (listing.host === viewer._id) {
                    throw new Error("Viewer can't book own listing");
                }

                const now = Date.now();
                const checkInDate = new Date(checkIn);
                const checkOutDate = new Date(checkOut);

                if (checkInDate.getTime() > now + MAX_DAYS_AHEAD * MILLISECONDS_PER_DAY) {
                    throw new Error(`Check in date can't be more than ${MAX_DAYS_AHEAD} days from today`);
                }

                if (checkOutDate.getTime() > now + MAX_DAYS_AHEAD * MILLISECONDS_PER_DAY) {
                    throw new Error(`Check out date can't be more than ${MAX_DAYS_AHEAD} days from today`);
                }

                if (checkOutDate < checkInDate) {
                    throw new Error("Check out date can't be before check in date");
                }

                const bookingsIndex = resolveBookingsIndex(listing.bookingsIndex, checkIn, checkOut);

                const totalPrice = listing.price * ((checkOutDate.getTime() - checkInDate.getTime()) / MILLISECONDS_PER_DAY + 1);

                const host = await db.users.findOne({ _id: listing.host });
                if (!host || !host.walletId) {
                    throw new Error("The host either can't be found or is not connected with Stripe");
                }

                await Stripe.charge(totalPrice, source, host.walletId);

                const insertResult = await db.bookings.insertOne({
                    _id: new ObjectId(),
                    listing: listing._id,
                    tenant: viewer._id,
                    checkIn,
                    checkOut,
                });

                const [insertedBooking] = insertResult.ops;

                await db.users.updateOne({ _id: host._id }, { $inc: { income: totalPrice } });

                await db.users.updateOne({ _id: viewer._id }, { $push: { bookings: insertedBooking._id } });

                await db.listings.updateOne({ _id: listing._id }, { $set: { bookingsIndex }, $push: { bookings: insertedBooking._id } });

                return insertedBooking;
            } catch (err) {
                throw new Error(`Failed to create a booking: ${err}`);
            }
        },
    },
    Booking: {
        id: (booking: Booking) => booking._id.toString(),
        listing: (booking: Booking, _args: {}, { db }: { db: Database }) => {
            return db.listings.findOne({ _id: booking.listing });
        },
        tenant: (booking: Booking, _args: {}, { db }: { db: Database }) => {
            return db.users.findOne({ _id: booking.tenant });
        },
    },
};
