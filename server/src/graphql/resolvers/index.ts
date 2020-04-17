import { merge } from 'lodash';

import { bookingResolvers } from './booking';
import { listingResolvers } from './listing';
import { viewerResolvers } from './viewer';

export const resolvers = merge(bookingResolvers, listingResolvers, viewerResolvers);
