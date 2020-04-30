import React, { FC, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { Col, Layout, Row } from 'antd';
import { Moment } from 'moment';

import { LISTING } from '../../core/graphql/queries/listing';
import { Listing as ListingData, ListingVariables } from '../../core/graphql/queries/__generated__/Listing';
import { PageSkeleton, ErrorBanner } from '../../components';
import { ListingDetails, ListingBookings, ListingCreateBooking, ListingCreateBookingModal } from './components';
import { useScrollToTop } from '../../core/hooks/use-scroll-to-top';
import './listing.scss';

const { Content } = Layout;

interface MatchParams {
    id: string;
}

const PAGE_LIMIT = 3;

export const Listing: FC = () => {
    useScrollToTop();

    const { id } = useParams<MatchParams>();

    const [bookingsPage, setBookingsPage] = useState(1);
    const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const { loading, data, error, refetch } = useQuery<ListingData, ListingVariables>(LISTING, {
        variables: { id, bookingsPage, limit: PAGE_LIMIT },
    });

    const clearBookingData = () => {
        setModalVisible(false);
        setCheckInDate(null);
        setCheckOutDate(null);
    };

    const handleListingRefetch = async () => {
        await refetch();
    };

    if (loading || error) {
        return (
            <Content className="listing">
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
            host={listing.host}
            price={listing.price}
            bookingsIndex={listing.bookingsIndex}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            setCheckInDate={setCheckInDate}
            setCheckOutDate={setCheckOutDate}
            setModalVisible={setModalVisible}
        />
    ) : null;
    const listingCreateBookingModalElement =
        listing && checkInDate && checkOutDate ? (
            <ListingCreateBookingModal
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                clearBookingData={clearBookingData}
                handleListingRefetch={handleListingRefetch}
                id={listing.id}
                price={listing.price}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
        ) : null;

    return (
        <Content className="listing">
            <Row gutter={24} justify="space-between">
                <Col xs={24} lg={14}>
                    {listingDetailsElement}
                    {listingBookingsElement}
                </Col>
                <Col xs={24} lg={10}>
                    {listingCreateBookingElement}
                </Col>
            </Row>
            {listingCreateBookingModalElement}
        </Content>
    );
};
