import React, { FC } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Button } from 'antd/es';

import { Listings as ListingsData, Listings_listings as Listing } from './__generated__/Listings';
import { DeleteListing as DeleteListingData, DeleteListingVariables } from './__generated__/DeleteListing';
import { CreateBooking as CreateBookingData, CreateBookingVariables } from './__generated__/CreateBooking';
import { FavoriteListing as FavoriteListingData, FavoriteListingVariables } from './__generated__/FavoriteListing';
import { ListFactory } from '../list';
import { useMessageContext } from '../../core/contexts/message-context';
import './listings.scss';

const List = ListFactory<Listing>();

const LISTINGS = gql`
    # query Listings {
    #     listings {
    #         id
    #         title
    #         image
    #         address
    #         numOfBookings
    #         favorite
    #     }
    # }
`;

const DELETE_LISTING = gql`
    # mutation DeleteListing($id: ID!) {
    #     deleteListing(id: $id) {
    #         id
    #     }
    # }
`;

const CREATE_BOOKING = gql`
    # mutation CreateBooking($id: ID!, $timestamp: String!) {
    #     createBooking(id: $id, timestamp: $timestamp) {
    #         id
    #     }
    # }
`;

const FAVORITE_LISTING = gql`
    # mutation FavoriteListing($id: ID!) {
    #     favoriteListing(id: $id) {
    #         id
    #     }
    # }
`;

const getErrorMessage = (reason = '') => {
    return `Uh oh! Something went wrong${reason} - please try again later :(`;
};

export const Listings: FC = () => {
    const { dispatch } = useMessageContext();
    const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);
    const [deleteListing, { error: deleteListingError, loading: deleteListingLoading }] = useMutation<
        DeleteListingData,
        DeleteListingVariables
    >(DELETE_LISTING);
    const [createBooking, { error: createBookingError, loading: createBookingLoading }] = useMutation<
        CreateBookingData,
        CreateBookingVariables
    >(CREATE_BOOKING);
    const [favoriteListing, { error: favoriteListingError, loading: favoriteListingLoading }] = useMutation<
        FavoriteListingData,
        FavoriteListingVariables
    >(FAVORITE_LISTING);
    const errorMessage = [error, deleteListingError, createBookingError, favoriteListingError].reduce((acc, err, i) => {
        const mappingArr = ['', ' with deleting', ' with creating a booking', 'with favoriting a listing'];
        if (err && acc === undefined) {
            acc = getErrorMessage(mappingArr[i]);
        }
        return acc;
    }, undefined as undefined | string);
    const spinning = deleteListingLoading || createBookingLoading || favoriteListingLoading;

    const handleDeleteListing = async (id: string) => {
        await deleteListing({ variables: { id } });
        refetch();
        dispatch({ type: 'DELETE_LISTING' });
    };

    const handleCreateBooking = async (id: string) => {
        await createBooking({ variables: { id, timestamp: new Date().toISOString() } });
        refetch();
        dispatch({ type: 'CREATE_BOOKING' });
    };

    const handleFavoriteListing = async (id: string) => {
        await favoriteListing({ variables: { id } });
        refetch();
    };

    return (
        <List
            className="listings"
            title="TinyHouse Listings"
            dataSource={data?.listings}
            spinning={spinning}
            isLoading={loading}
            errorMessage={errorMessage}
            actionsRenderer={({ id, favorite }) => [
                <Button type="default" onClick={() => handleFavoriteListing(id)}>
                    {favorite ? 'Unfavorite' : 'Favorite'}
                </Button>,
                <Button type="primary" onClick={() => handleCreateBooking(id)}>
                    Book
                </Button>,
                <Button type="danger" onClick={() => handleDeleteListing(id)}>
                    Delete
                </Button>,
            ]}
            contentRenderer={({ numOfBookings, favorite }) => (
                <div className="listings__item-content">
                    {favorite && (
                        <span role="img" aria-label="favorite">
                            ❤️
                        </span>
                    )}
                    {!!numOfBookings && <span>{numOfBookings}× booked</span>}
                </div>
            )}
        />
    );
};
