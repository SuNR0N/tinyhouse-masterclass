export interface State<TData = any> {
    data: TData | null;
    loading: boolean;
    error: boolean;
}

export const initialState: State = {
    data: null,
    error: false,
    loading: false,
};

type Action<TData> = { type: 'FETCH' } | { type: 'FETCH_SUCCESS'; payload: TData } | { type: 'FETCH_ERROR' };

export const createFetchReducer = <TData>() => (state: State<TData>, action: Action<TData>): State<TData> => {
    switch (action.type) {
        case 'FETCH':
            return {
                ...state,
                loading: true,
            };
        case 'FETCH_SUCCESS':
            return {
                data: action.payload,
                loading: false,
                error: false,
            };
        case 'FETCH_ERROR':
            return {
                ...state,
                loading: false,
                error: true,
            };
        default:
            throw new Error();
    }
};
