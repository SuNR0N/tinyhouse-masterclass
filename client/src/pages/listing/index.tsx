import React, { FC, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Layout, Row } from 'antd';
import { Moment } from 'moment';

import { LISTING } from '../../core/graphql/queries/listing';
import { Listing as ListingData, ListingVariables } from '../../core/graphql/queries/__generated__/Listing';
import { PageSkeleton, ErrorBanner } from '../../components';
import { ListingDetails, ListingBookings, ListingCreateBooking } from './components';

const { Content } = Layout;

interface MathchParams {
    id: string;
}

const PAGE_LIMIT = 3;

export const Listing: FC<RouteComponentProps<MathchParams>> = ({ match }) => {
    const [bookingsPage, setBookingsPage] = useState(1);
    const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);

    const { loading, data, error } = useQuery<ListingData, ListingVariables>(LISTING, {
        variables: { id: match.params.id, bookingsPage, limit: PAGE_LIMIT },
    });

    if (loading || error) {
        return (
            <Content className="listings">
                {error && <ErrorBanner description="This listing may not exist or we've encountered an error. Please try again soon!" />}
                <PageSkeleton />
            </Content>
        );
    }

    const listing = data ? data.listing : null;
    const listingBookings = listing ? listing.bookings : null;

    const listingDetailsElement = listing ? <ListingDetails listing={listing} /> : null;
    const listingBookingsElement = listingBookings ? (
        <ListingBookings
            listingBookings={listingBookings}
            bookingsPage={bookingsPage}
            limit={PAGE_LIMIT}
            setBookingsPage={setBookingsPage}
        />
    ) : null;
    const listingCreateBookingElement = listing ? (
        <ListingCreateBooking
            price={listing.price}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            setCheckInDate={setCheckInDate}
            setCheckOutDate={setCheckOutDate}
        />
    ) : null;

    return (
        <Content className="listings">
            <Row gutter={24} justify="space-between">
                <Col xs={24} lg={14}>
                    {listingDetailsElement}
                    {listingBookingsElement}
                </Col>
                <Col xs={24} lg={10}>
                    {listingCreateBookingElement}
                </Col>
            </Row>
        </Content>
    );
};
