import { useReducer, useEffect, useCallback } from 'react';

import { server } from '../api';
import { State, createFetchReducer, initialState } from './create-fetch-reducer';

interface QueryResult<TData> extends State<TData> {
    refetch: () => void;
}

export const useQuery = <TData = any>(query: string): QueryResult<TData> => {
    const [state, dispatch] = useReducer(createFetchReducer<TData>(), initialState);

    const fetch = useCallback(() => {
        const fetchApi = async () => {
            dispatch({ type: 'FETCH' });
            try {
                const { data, errors } = await server.fetch<TData>({ query });
                const [error] = errors || [];
                if (error) {
                    throw new Error(error.message);
                }
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_ERROR' });
                throw console.error(err);
            }
        };
        fetchApi();
    }, [query]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return {
        ...state,
        refetch: fetch,
    };
};
