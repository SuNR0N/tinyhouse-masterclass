import { merge } from 'lodash';

import { bookingResolvers } from './booking';
import { listingResolvers } from './listing';

export const resolvers = merge(bookingResolvers, listingResolvers);
