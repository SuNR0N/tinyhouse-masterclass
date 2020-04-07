import { Collection } from 'mongodb';

import { Booking, Listing } from './';

export interface Database {
    bookings: Collection<Booking>;
    listings: Collection<Listing>;
}
