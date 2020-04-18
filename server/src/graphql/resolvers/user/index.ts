import { IResolvers } from 'apollo-server-express';
import { Request } from 'express';

import { Database, User, Booking, Listing } from '../../../models';
import { UserArgs, PaginationArgs, PaginatedListData } from './types';
import { authorize } from '../../../utils';

export const userResolvers: IResolvers = {
    Query: {
        user: async (_root: undefined, { id }: UserArgs, { db, req }: { db: Database; req: Request }) => {
            try {
                const user = await db.users.findOne({ _id: id });

                if (!user) {
                    throw new Error("User can't be found");
                }

                const viewer = await authorize(db, req);
                if (viewer && viewer._id === user._id) {
                    user.authorized = true;
                }

                return user;
            } catch (err) {
                throw new Error(`Failed to query user: ${err}`);
            }
        },
    },
    User: {
        id: (user: User) => user._id,
        hasWallet: (user: User) => Boolean(user.walletId),
        income: (user: User) => (user.authorized ? user.income : null),
        bookings: async (user: User, { limit, page }: PaginationArgs, { db }: { db: Database }) => {
            try {
                if (!user.authorized) {
                    return null;
                }

                const data: PaginatedListData<Booking> = {
                    total: 0,
                    result: [],
                };

                let cursor = await db.bookings.find({
                    _id: { $in: user.bookings },
                });
                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);

                data.total = await cursor.count();
                data.result = await cursor.toArray();

                return data;
            } catch (err) {
                throw new Error(`Failed to query user bookings: ${err}`);
            }
        },
        listings: async (user: User, { limit, page }: PaginationArgs, { db }: { db: Database }) => {
            try {
                const data: PaginatedListData<Listing> = {
                    total: 0,
                    result: [],
                };

                let cursor = await db.listings.find({
                    _id: { $in: user.listings },
                });
                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);

                data.total = await cursor.count();
                data.result = await cursor.toArray();

                return data;
            } catch (err) {
                throw new Error(`Failed to query user listings: ${err}`);
            }
        },
    },
};
