import { Collection } from 'mongodb';

import { Listing } from './listing';

export interface Database {
    listings: Collection<Listing>;
}
