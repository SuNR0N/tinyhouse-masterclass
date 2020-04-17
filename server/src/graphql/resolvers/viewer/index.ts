import crypto from 'crypto';
import { Response, Request } from 'express';
import { IResolvers } from 'apollo-server-express';

import { Configuration } from '../../../config';
import { Google } from '../../../api/google';
import { LogInArgs } from './types';
import { Database, Viewer } from '../../../models';

const { ENVIRONMENT } = Configuration;

const cookieOptions = {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: ENVIRONMENT === 'development' ? false : true,
};
const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;

const logInViaGoogle = async (code: string, token: string, db: Database, res: Response) => {
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

    res.cookie('viewer', userId, { ...cookieOptions, maxAge: ONE_YEAR_IN_MS });

    return viewer;
};

const logInViaCookie = async (token: string, db: Database, req: Request, res: Response) => {
    const updateResult = await db.users.findOneAndUpdate({ _id: req.signedCookies.viewer }, { $set: { token } }, { returnOriginal: false });

    const viewer = updateResult.value;

    if (!viewer) {
        res.clearCookie('viewer', cookieOptions);
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
        logIn: async (_root: undefined, { input }: LogInArgs, { db, req, res }: { db: Database; req: Request; res: Response }) => {
            try {
                const code = input ? input.code : null;
                const token = crypto.randomBytes(16).toString('hex');

                const viewer = code ? await logInViaGoogle(code, token, db, res) : await logInViaCookie(token, db, req, res);

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
        logOut: (_root: undefined, _args: {}, { res }: { res: Response }) => {
            try {
                res.clearCookie('viewer', cookieOptions);
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
