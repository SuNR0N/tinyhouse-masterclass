import { IResolvers } from 'apollo-server-express';
import { ObjectId } from 'mongodb';
import { Request } from 'express';

import { Database, Listing, Booking } from '../../../models';
import { ListingArgs, ListingsArgs, ListingsFilter } from './types';
import { authorize } from '../../../utils';
import { PaginatedListData, PaginationArgs } from '../types';

export const listingResolvers: IResolvers = {
    Query: {
        listing: async (_root: undefined, { id }: ListingArgs, { db, req }: { db: Database; req: Request }) => {
            try {
                const listing = await db.listings.findOne({
                    _id: new ObjectId(id),
                });

                if (!listing) {
                    throw new Error(`Listing with id "${id}" cannot be found`);
                }

                const viewer = await authorize(db, req);
                if (viewer && viewer._id === listing.host) {
                    listing.authorized = true;
                }

                return listing;
            } catch (err) {
                throw new Error(`Failed to query listing: ${err}`);
            }
        },
        listings: async (_root: undefined, { filter, limit, page }: ListingsArgs, { db }: { db: Database }) => {
            try {
                const data: PaginatedListData<Listing> = {
                    total: 0,
                    result: [],
                };

                let cursor = await db.listings.find({});

                switch (filter) {
                    case ListingsFilter.PRICE_HIGH_TO_LOW:
                        cursor.sort({ price: -1 });
                        break;
                    case ListingsFilter.PRICE_LOW_TO_HIGH:
                        cursor.sort({ price: 1 });
                        break;
                }

                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);

                data.total = await cursor.count();
                data.result = await cursor.toArray();

                return data;
            } catch (err) {
                throw new Error(`Failed to query listings: ${err}`);
            }
        },
    },
    Mutation: {
        deleteListing: async (_root: undefined, { id }: { id: string }, { db }: { db: Database }) => {
            const { value } = await db.listings.findOneAndDelete({
                _id: new ObjectId(id),
            });

            if (!value) {
                throw new Error(`Failed to delete listing with id: ${id}`);
            }

            await db.bookings.deleteMany({ address: value.address, image: value.image, title: value.title });

            return value;
        },
        // TODO: Make it work again
        // favoriteListing: async (_root: undefined, { id }: { id: string }, { db }: { db: Database }) => {
        //     const listing = await db.listings.findOne({ _id: new ObjectId(id) });

        //     if (!listing) {
        //         throw new Error(`Failed to get listing with id: ${id}`);
        //     }

        //     const updatedListing: Listing = {
        //         ...listing,
        //         favorite: !listing.favorite,
        //     };

        //     const { modifiedCount } = await db.listings.updateOne(
        //         { _id: new ObjectId(id) },
        //         {
        //             $set: {
        //                 favorite: updatedListing.favorite,
        //             },
        //         }
        //     );

        //     if (modifiedCount === 0) {
        //         throw new Error(`Failed to update favorite property of listing with id: ${id}`);
        //     }

        //     return updatedListing;
        // },
    },
    Listing: {
        id: (listing: Listing) => listing._id.toString(),
        bookings: async (listing: Listing, { limit, page }: PaginationArgs, { db }: { db: Database }) => {
            try {
                if (!listing.authorized) {
                    return null;
                }

                const data: PaginatedListData<Booking> = {
                    total: 0,
                    result: [],
                };

                let cursor = await db.bookings.find({
                    _id: { $in: listing.bookings },
                });

                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);

                data.total = await cursor.count();
                data.result = await cursor.toArray();

                return data;
            } catch (err) {
                throw new Error(`Failed to query listing bookings: ${err}`);
            }
        },
        host: async (listing: Listing, _args: {}, { db }: { db: Database }) => {
            const host = await db.users.findOne({ _id: listing.host });
            if (!host) {
                throw new Error("Host can't be found");
            }

            return host;
        },
        bookingsIndex: (listing: Listing) => JSON.stringify(listing.bookingsIndex),
        // numOfBookings: async (listing: Listing, _args: {}, { db }: { db: Database }) => {
        //     const { address, image, title } = listing;
        //     return await db.bookings.find({ address, image, title }).count();
        // },
    },
};
