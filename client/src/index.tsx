import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import './styles/styles.scss';
import * as serviceWorker from './serviceWorker';
import { Listings } from './components';

const client = new ApolloClient({
    uri: '/api',
});

render(
    <ApolloProvider client={client}>
        <Listings title="TinyHouse Listings" />
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
