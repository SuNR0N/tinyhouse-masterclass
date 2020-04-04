import { listings } from '../listings';
import { Listing } from '../models/listing';

export const resolvers = {
    Query: {
        listings: (): Listing[] => listings,
    },
    Mutation: {
        deleteListing: (_root: undefined, { id }: { id: string }): Listing => {
            const indexToDelete = listings.findIndex((listing) => listing.id === id);
            if (indexToDelete > -1) {
                return listings.splice(indexToDelete, 1)[0];
            }

            throw new Error(`Failed to delete listing with id: ${id}`);
        },
    },
};
