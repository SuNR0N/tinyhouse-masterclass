import React, { FC, useState } from 'react';
import { useQuery } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Layout, Row } from 'antd';

import { USER } from '../../core/graphql/queries/user';
import { User as UserData, UserVariables } from '../../core/graphql/queries/__generated__/User';
import { UserProfile, UserListings, UserBookings } from './components';
import { Viewer } from '../../core/models';
import { ErrorBanner, PageSkeleton } from '../../components';
import './user.scss';

const { Content } = Layout;

interface MatchParams {
    id: string;
}

interface Props extends RouteComponentProps<MatchParams> {
    viewer: Viewer;
}

const PAGE_LIMIT = 4;

export const User: FC<Props> = ({ match, viewer }) => {
    const [listingsPage, setListingsPage] = useState(1);
    const [bookingsPage, setBookingsPage] = useState(1);
    const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
        variables: { id: match.params.id, bookingsPage, listingsPage, limit: PAGE_LIMIT },
    });

    if (loading || error) {
        return (
            <Content className="user">
                {error && <ErrorBanner description="This user may not exist or we've encountered an error. Please try again soon." />}
                <PageSkeleton />
            </Content>
        );
    }

    const user = data ? data.user : null;
    const viewerIsUser = viewer.id === match.params.id;

    const userListings = user ? user.listings : null;
    const userBookings = user ? user.bookings : null;

    const userProfileElement = user ? <UserProfile user={user} viewerIsUser={viewerIsUser} /> : null;
    const userListingsElement = userListings ? (
        <UserListings userListings={userListings} listingsPage={listingsPage} limit={PAGE_LIMIT} setListingsPage={setListingsPage} />
    ) : null;
    const userBookingsElement = userBookings ? (
        <UserBookings userBookings={userBookings} bookingsPage={bookingsPage} limit={PAGE_LIMIT} setBookingsPage={setBookingsPage} />
    ) : null;

    return (
        <Content className="user">
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
