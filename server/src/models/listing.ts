import { ObjectId } from 'mongodb';

import { ListingType } from './listing-type';
import { BookingsIndex } from './bookings-index';

export interface Listing {
    _id: ObjectId;
    title: string;
    description: string;
    image: string;
    host: string;
    type: ListingType;
    address: string;
    country: string;
    admin: string;
    city: string;
    bookings: ObjectId[];
    bookingsIndex: BookingsIndex;
    price: number;
    numOfGuests: number;
    authorized?: boolean;
    // favorite: boolean; // Refactor
    // numOfBaths: number;
    // numOfBeds: number;
    // numOfBookings: number; // Use bookings field instead
    // rating: number; // Store it as a map perhaps?
}
