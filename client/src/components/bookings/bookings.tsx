import React, { FC, useEffect, useCallback } from 'react';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';

import { Bookings as BookingsData, Bookings_bookings as Booking } from './__generated__/Bookings';
import { ListFactory } from '../list';
import { useMessageContext } from '../../core/contexts/message-context';

const List = ListFactory<Booking>();

const BOOKINGS = gql`
    query Bookings {
        bookings {
            address
            image
            timestamp
            title
        }
    }
`;

export const Bookings: FC = () => {
    const { messages } = useMessageContext();
    const { data, loading, error, refetch } = useQuery<BookingsData>(BOOKINGS);
    const errorMessage = error ? 'Uh oh! Something went wrong - please try again later :(' : undefined;

    const refetchCb = useCallback(() => {
        const fetch = async () => {
            await refetch();
        };
        fetch();
    }, [refetch]);

    useEffect(() => {
        const [lastMessage] = messages.slice(-1);
        if (lastMessage === 'CREATE_BOOKING' || lastMessage === 'DELETE_LISTING') {
            refetchCb();
        }
    }, [messages, refetchCb]);

    return (
        <List
            title="Your Bookings"
            dataSource={data?.bookings}
            isLoading={loading}
            errorMessage={errorMessage}
            contentRenderer={({ timestamp }) => <time>{new Date(timestamp).toLocaleString()}</time>}
        />
    );
};
