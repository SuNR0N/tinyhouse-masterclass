import { IResolvers } from 'apollo-server-express';
import { ObjectId } from 'mongodb';

import { Database, Listing } from '../../../models';

export const listingResolvers: IResolvers = {
    Query: {
        listings: async (_root: undefined, _args: {}, { db }: { db: Database }) => {
            return await db.listings.find({}).toArray();
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
        // numOfBookings: async (listing: Listing, _args: {}, { db }: { db: Database }) => {
        //     const { address, image, title } = listing;
        //     return await db.bookings.find({ address, image, title }).count();
        // },
    },
};
