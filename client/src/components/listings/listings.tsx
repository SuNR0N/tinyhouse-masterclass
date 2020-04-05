import React, { FC } from 'react';

import { server } from '../core/api';
import { DeleteListingData, DeleteListingVariables, ListingsData } from './types';

const LISTINGS = `
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

const DELETE_LISTING = `
    mutation DeleteListing($id: ID!) {
        deleteListing(id: $id) {
            id
        }
    }
`;

interface Props {
    title: string;
}

export const Listings: FC<Props> = ({ title }) => {
    const fetchListings = async () => {
        const {
            data: { listings },
        } = await server.fetch<ListingsData>({ query: LISTINGS });
        console.log(listings);
    };

    const deleteListing = async () => {
        const {
            data: { deleteListing },
        } = await server.fetch<DeleteListingData, DeleteListingVariables>({
            query: DELETE_LISTING,
            variables: {
                id: '',
            },
        });
        console.log(deleteListing);
    };

    return (
        <div>
            <h2>{title}</h2>
            <button onClick={fetchListings}>Query Listings!</button>
            <button onClick={deleteListing}>Delete a Listing!</button>
        </div>
    );
};
