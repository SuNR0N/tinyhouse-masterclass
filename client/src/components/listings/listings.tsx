import React, { FC } from 'react';

import { DeleteListingData, DeleteListingVariables, ListingsData } from './types';
import { useMutation, useQuery } from '../core/hooks';
import { DELETE_LISTING, LISTINGS } from '../core/constants/queries';

interface Props {
    title: string;
}

export const Listings: FC<Props> = ({ title }) => {
    const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);
    const [deleteListing, { error: deleteListingError, loading: deleteListingLoading }] = useMutation<
        DeleteListingData,
        DeleteListingVariables
    >(DELETE_LISTING);

    const handleDeleteListing = async (id: string) => {
        await deleteListing({ id });
        refetch();
    };

    const listingsList = data?.listings ? (
        <ul>
            {data.listings.map(({ id, title }) => (
                <li key={id}>
                    {title}
                    <button onClick={() => handleDeleteListing(id)}>Delete</button>
                </li>
            ))}
        </ul>
    ) : null;

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>Uh oh! Something went wrong - please try again later :(</h2>;
    }

    const deleteListingLoadingMessage = deleteListingLoading ? <h4>Deletion in progress...</h4> : null;
    const deleteListingErrorMessage = deleteListingError ? (
        <h4>Uh oh! Something went wrong with deleting - please try again later :(</h4>
    ) : null;

    return (
        <div>
            <h2>{title}</h2>
            {listingsList}
            {deleteListingLoadingMessage}
            {deleteListingErrorMessage}
        </div>
    );
};
