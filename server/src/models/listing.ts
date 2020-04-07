import { ObjectId } from 'mongodb';

export interface Listing {
    _id: ObjectId;
    address: string;
    favorite: boolean;
    image: string;
    numOfBaths: number;
    numOfBeds: number;
    numOfBookings: number;
    numOfGuests: number;
    price: number;
    rating: number;
    title: string;
}
