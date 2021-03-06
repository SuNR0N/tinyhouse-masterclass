import { ObjectId } from 'mongodb';

export interface User {
    _id: string;
    token: string;
    name: string;
    avatar: string;
    contact: string;
    walletId: string | null;
    income: number;
    bookings: ObjectId[];
    listings: ObjectId[];
    authorized?: boolean;
}
