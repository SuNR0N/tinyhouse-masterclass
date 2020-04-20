import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Divider, List, Typography } from 'antd';

import { Listing } from '../../../../core/graphql/queries/__generated__/Listing';
import './listing-bookings.scss';

const { Text, Title } = Typography;

interface Props {
    bookingsPage: number;
    limit: number;
    listingBookings: Listing['listing']['bookings'];
    setBookingsPage: (page: number) => void;
}

export const ListingBookings: FC<Props> = ({ bookingsPage, limit, listingBookings, setBookingsPage }) => {
    const total = listingBookings ? listingBookings.total : null;
    const result = listingBookings ? listingBookings.result : null;

    const listingBookingsList = listingBookings ? (
        <List
            grid={{
                gutter: 8,
                xs: 1,
                sm: 2,
                lg: 3,
            }}
            dataSource={result ? result : undefined}
            locale={{ emptyText: 'No bookings have been made yet!' }}
            pagination={{
                current: bookingsPage,
                total: total ? total : undefined,
                defaultPageSize: limit,
                hideOnSinglePage: true,
                showLessItems: true,
                onChange: (page: number) => setBookingsPage(page),
            }}
            renderItem={(listingBooking) => {
                const bookingHistory = (
                    <div className="listing-bookings__history">
                        <div>
                            Check in: <Text strong>{listingBooking.checkIn}</Text>
                        </div>
                        <div>
                            Check out: <Text strong>{listingBooking.checkOut}</Text>
                        </div>
                    </div>
                );

                return (
                    <List.Item className="listing-bookings__item">
                        {bookingHistory}
                        <Link to={`/user/${listingBooking.tenant.id}`}>
                            <Avatar src={listingBooking.tenant.avatar} size={64} shape="square" />
                        </Link>
                    </List.Item>
                );
            }}
        />
    ) : null;

    const listingBookingsElement = listingBookingsList ? (
        <div className="listing-bookings">
            <Divider />
            <div className="listing-bookings__section">
                <Title level={4}>Bookings</Title>
                {listingBookingsList}
            </div>
        </div>
    ) : null;

    return listingBookingsElement;
};
