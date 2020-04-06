import React, { FC } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Alert, Avatar, Button, List, Spin } from 'antd/es';

import './listings.scss';
import { Listings as ListingsData } from './__generated__/Listings';
import { DeleteListing as DeleteListingData, DeleteListingVariables } from './__generated__/DeleteListing';
import { ListingsSkeleton } from './helpers/listings-skeleton';

interface Props {
    title: string;
}

const LISTINGS = gql`
    query Listings {
        listings {
            id
            title
            image
            address
            price
            numOfGuests
            numOfBeds
            rating
        }
    }
`;

const DELETE_LISTING = gql`
    mutation DeleteListing($id: ID!) {
        deleteListing(id: $id) {
            id
        }
    }
`;

export const Listings: FC<Props> = ({ title }) => {
    const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);
    const [deleteListing, { error: deleteListingError, loading: deleteListingLoading }] = useMutation<
        DeleteListingData,
        DeleteListingVariables
    >(DELETE_LISTING);

    const handleDeleteListing = async (id: string) => {
        await deleteListing({ variables: { id } });
        refetch();
    };

    const listingsList = data?.listings ? (
        <List
            itemLayout="horizontal"
            dataSource={data?.listings}
            renderItem={({ title, address, image, id }) => (
                <List.Item
                    actions={[
                        <Button type="primary" onClick={() => handleDeleteListing(id)}>
                            Delete
                        </Button>,
                    ]}
                >
                    <List.Item.Meta title={title} description={address} avatar={<Avatar src={image} shape="square" size={48} />} />
                </List.Item>
            )}
        />
    ) : null;

    if (loading || error) {
        return (
            <div className="listings">
                <ListingsSkeleton {...{ title, error: !!error }} />
            </div>
        );
    }

    const deleteListingErrorAlert = deleteListingError ? (
        <Alert type="error" message="Uh oh! Something went wrong with deleting - please try again later :(" className="listings__alert" />
    ) : null;

    return (
        <div className="listings">
            <Spin spinning={deleteListingLoading} />
            {deleteListingErrorAlert}
            <h2>{title}</h2>
            {listingsList}
        </div>
    );
};
