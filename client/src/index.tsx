import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import './styles/styles.scss';
import * as serviceWorker from './serviceWorker';
import { Bookings, Listings } from './components';
import { MessageContextProvider } from './core/contexts/message-context';

const client = new ApolloClient({
    uri: '/api',
});

render(
    <ApolloProvider client={client}>
        <MessageContextProvider>
            <Listings />
            <Bookings />
        </MessageContextProvider>
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
