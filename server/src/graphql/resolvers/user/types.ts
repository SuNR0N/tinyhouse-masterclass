export interface UserArgs {
    id: string;
}

export interface PaginationArgs {
    limit: number;
    page: number;
}

export interface PaginatedListData<T> {
    total: number;
    result: T[];
}
