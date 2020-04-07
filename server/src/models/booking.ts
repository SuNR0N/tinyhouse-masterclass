import { ObjectId } from 'mongodb';

export interface Booking {
    _id: ObjectId;
    title: string;
    image: string;
    address: string;
    timestamp: string;
}
