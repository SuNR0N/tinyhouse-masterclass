import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import * as serviceWorker from './serviceWorker';
import { App } from './app';
import './styles/styles.scss';

const client = new ApolloClient({
    uri: '/api',
    request: async (operation) => {
        const token = sessionStorage.getItem('token');
        operation.setContext({
            headers: {
                'X-CSRF-TOKEN': token || '',
            },
        });
    },
});

render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
