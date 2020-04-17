import crypto from 'crypto';
import { IResolvers } from 'apollo-server-express';

import { Google } from '../../../api/google';
import { LogInArgs } from './types';
import { Database, Viewer } from '../../../models';

const logInViaGoogle = async (code: string, token: string, db: Database) => {
    const { user } = await Google.logIn(code);

    if (!user) {
        throw new Error('Google login error');
    }

    const userNamesList = user.names?.length ? user.names : null;
    const userPhotosList = user.photos?.length ? user.photos : null;
    const userEmailsList = user.emailAddresses?.length ? user.emailAddresses : null;

    const userName = (userNamesList && userNamesList[0].displayName) || null;

    const userId = (userNamesList && userNamesList[0].metadata?.source?.id) || null;

    const userAvatar = (userPhotosList && userPhotosList[0].url) || null;

    const userEmail = (userEmailsList && userEmailsList[0].value) || null;

    if (!userId || !userName || !userAvatar || !userEmail) {
        throw new Error('Google login error');
    }

    const updateResult = await db.users.findOneAndUpdate(
        { _id: userId },
        { $set: { name: userName, avatar: userAvatar, contact: userEmail, token } },
        { returnOriginal: false }
    );

    let viewer = updateResult.value;

    if (!viewer) {
        const insertResult = await db.users.insertOne({
            _id: userId,
            token,
            name: userName,
            avatar: userAvatar,
            contact: userEmail,
            income: 0,
            bookings: [],
            listings: [],
        });

        viewer = insertResult.ops[0];
    }

    return viewer;
};

export const viewerResolvers: IResolvers = {
    Query: {
        authUrl: () => {
            try {
                return Google.authUrl;
            } catch (err) {
                throw new Error(`Failed to query Google Auth Url: ${err}`);
            }
        },
    },
    Mutation: {
        logIn: async (_root: undefined, { input }: LogInArgs, { db }: { db: Database }) => {
            try {
                const code = input ? input.code : null;
                const token = crypto.randomBytes(16).toString('hex');

                const viewer = code ? await logInViaGoogle(code, token, db) : undefined;

                return {
                    didRequest: true,
                    ...(viewer && {
                        _id: viewer._id,
                        token: viewer.token,
                        avatar: viewer.avatar,
                        walletId: viewer.walletId,
                    }),
                };
            } catch (err) {
                throw new Error(`Failed to log in: ${err}`);
            }
        },
        logOut: () => {
            try {
                return { didRequest: true };
            } catch (err) {
                throw new Error(`Failed to log out: ${err}`);
            }
        },
    },
    Viewer: {
        id: (viewer: Viewer) => viewer._id,
        hasWallet: (viewer: Viewer) => (viewer.walletId ? true : undefined),
    },
};
