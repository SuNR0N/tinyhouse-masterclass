import React, { useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { Affix, Layout } from 'antd';

import './styles/styles.scss';
import * as serviceWorker from './serviceWorker';
// import { MessageContextProvider } from './core/contexts/message-context';
import { Home, Host, Listing, Listings, Login, NotFound, User } from './pages';
import { Viewer } from './core/models/viewer';
import { AppHeader } from './components/app-header';

const client = new ApolloClient({
    uri: '/api',
});

const initialViewer: Viewer = {
    avatar: null,
    didRequest: false,
    hasWallet: null,
    id: null,
    token: null,
};

const App = () => {
    const [viewer, setViewer] = useState<Viewer>(initialViewer);

    return (
        <Router>
            <Layout id="app">
                <Affix offsetTop={0}>
                    <AppHeader viewer={viewer} setViewer={setViewer} />
                </Affix>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/host" component={Host} />
                    <Route exact path="/listing/:id" component={Listing} />
                    <Route exact path="/listings/:location?" component={Listings} />
                    <Route exact path="/login" render={(props) => <Login {...props} setViewer={setViewer} />} />
                    <Route exact path="/user/:id" component={User} />
                    <Route component={NotFound} />
                </Switch>
            </Layout>
        </Router>
    );
};

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
