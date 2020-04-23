import { PaginationArgs, PaginatedListData } from '../types';
import { ListingType, Listing } from '../../../models';

export enum ListingsFilter {
    PRICE_LOW_TO_HIGH = 'PRICE_LOW_TO_HIGH',
    PRICE_HIGH_TO_LOW = 'PRICE_HIGH_TO_LOW',
}

export interface ListingArgs {
    id: string;
}

export interface ListingsArgs extends PaginationArgs {
    filter: ListingsFilter;
    location: string | null;
}

export interface ListingsQuery {
    country?: string;
    admin?: string;
    city?: string;
}

export interface ListingsData extends PaginatedListData<Listing> {
    region: string | null;
}

export interface HostListingInput {
    title: string;
    description: string;
    image: string;
    type: ListingType;
    address: string;
    price: number;
    numOfGuests: number;
}

export interface HostListingsArgs {
    input: HostListingInput;
}
