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

            return value;
        },
    },
    Listing: {
        id: (listing: Listing) => listing._id.toString(),
    },
};
