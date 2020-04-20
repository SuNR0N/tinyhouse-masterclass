import { PaginationArgs } from '../types';

export enum ListingsFilter {
    PRICE_LOW_TO_HIGH = 'PRICE_LOW_TO_HIGH',
    PRICE_HIGH_TO_LOW = 'PRICE_HIGH_TO_LOW',
}

export interface ListingArgs {
    id: string;
}

export interface ListingsArgs extends PaginationArgs {
    filter: ListingsFilter;
}
