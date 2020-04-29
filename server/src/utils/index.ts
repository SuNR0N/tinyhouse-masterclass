import { Request } from 'express';
import { Database } from '../types/database';

export const authorize = async (db: Database, req: Request) => {
    const token = req.get('X-CSRF-TOKEN');
    const viewer = await db.users.findOne({
        _id: req.signedCookies.viewer,
        token,
    });

    return viewer;
};
