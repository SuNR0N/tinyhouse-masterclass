import { Collection } from 'mongodb';

import { Booking, Listing, User } from './';

export interface Database {
    bookings: Collection<Booking>;
    listings: Collection<Listing>;
    users: Collection<User>;
}
