import moment, { Moment } from 'moment';

import { BookingsIndex } from '../models/bookings-index';

export const isBooked = (date: Moment, bookingsIndex: BookingsIndex) => {
    const year = moment(date).year();
    const month = moment(date).month();
    const day = moment(date).date();

    if (bookingsIndex[year] && bookingsIndex[year][month]) {
        return Boolean(bookingsIndex[year][month][day]);
    } else {
        return false;
    }
};
