import { ObjectId } from 'mongodb';

export interface Booking {
    _id: ObjectId;
    listing: ObjectId;
    tenant: string;
    checkIn: string;
    checkOut: string;
}
