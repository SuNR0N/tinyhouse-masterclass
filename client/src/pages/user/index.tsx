import React, { FC, useState } from 'react';
import { useQuery } from 'react-apollo';
import { useParams } from 'react-router-dom';
import { Col, Layout, Row } from 'antd';

import { USER } from '../../core/graphql/queries/user';
import { User as UserData, UserVariables } from '../../core/graphql/queries/__generated__/User';
import { UserProfile, UserListings, UserBookings } from './components';
import { Viewer } from '../../core/models';
import { ErrorBanner, PageSkeleton } from '../../components';
import { useScrollToTop } from '../../core/hooks/use-scroll-to-top';
import './user.scss';

const { Content } = Layout;

interface MatchParams {
    id: string;
}

interface Props {
    setViewer: (viewer: Viewer) => void;
    viewer: Viewer;
}

const PAGE_LIMIT = 4;

export const User: FC<Props> = ({ setViewer, viewer }) => {
    useScrollToTop();

    const { id } = useParams<MatchParams>();

    const [listingsPage, setListingsPage] = useState(1);
    const [bookingsPage, setBookingsPage] = useState(1);
    const { data, loading, error, refetch } = useQuery<UserData, UserVariables>(USER, {
        variables: { id, bookingsPage, listingsPage, limit: PAGE_LIMIT },
        fetchPolicy: 'cache-and-network',
    });

    const handleUserRefetch = async () => {
        await refetch();
    };

    const stripeError = new URL(window.location.href).searchParams.get('stripe_error');

    if (loading || error) {
        return (
            <Content className="user">
                {error && <ErrorBanner description="This user may not exist or we've encountered an error. Please try again soon." />}
                <PageSkeleton />
            </Content>
        );
    }

    const user = data ? data.user : null;
    const viewerIsUser = viewer.id === id;

    const userListings = user ? user.listings : null;
    const userBookings = user ? user.bookings : null;

    const userProfileElement = user ? (
        <UserProfile handleUserRefetch={handleUserRefetch} setViewer={setViewer} user={user} viewer={viewer} viewerIsUser={viewerIsUser} />
    ) : null;
    const userListingsElement = userListings ? (
        <UserListings userListings={userListings} listingsPage={listingsPage} limit={PAGE_LIMIT} setListingsPage={setListingsPage} />
    ) : null;
    const userBookingsElement = userBookings ? (
        <UserBookings userBookings={userBookings} bookingsPage={bookingsPage} limit={PAGE_LIMIT} setBookingsPage={setBookingsPage} />
    ) : null;
    const stripeErrorBannerElement = stripeError ? (
        <ErrorBanner description="We had an issue connecting with Stripe. Please try again soon." />
    ) : null;

    return (
        <Content className="user">
            {stripeErrorBannerElement}
            <Row gutter={12} justify="space-between">
                <Col xs={24}>{userProfileElement}</Col>
                <Col xs={24}>
                    {userListingsElement}
                    {userBookingsElement}
                </Col>
            </Row>
        </Content>
    );
};
