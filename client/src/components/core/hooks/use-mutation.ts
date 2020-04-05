import { useReducer } from 'react';

import { server } from '../api';
import { State, createFetchReducer, initialState } from './create-fetch-reducer';

type MutationTuple<TData, TVariables> = [(variables?: TVariables) => Promise<void>, State<TData>];

export const useMutation = <TData = any, TVariables = any>(query: string): MutationTuple<TData, TVariables> => {
    const [state, dispatch] = useReducer(createFetchReducer<TData>(), initialState);

    const fetch = async (variables?: TVariables) => {
        dispatch({ type: 'FETCH' });
        try {
            const { data, errors } = await server.fetch<TData, TVariables>({ query, variables });
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

    return [fetch, state];
};
