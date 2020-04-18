import React, { FC, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Layout, Spin, Affix } from 'antd';

import { Viewer } from './core/models/viewer';
import { LogIn as LogInData, LogInVariables } from './core/graphql/mutations/__generated__/LogIn';
import { LOG_IN } from './core/graphql/mutations/log-in';
import { AppHeaderSkeleton, ErrorBanner, AppHeader } from './components';
import { Home, Host, Listing, Listings, Login, NotFound, User } from './pages';
import './app.scss';

const initialViewer: Viewer = {
    avatar: null,
    didRequest: false,
    hasWallet: null,
    id: null,
    token: null,
};

export const App: FC = () => {
    const [viewer, setViewer] = useState<Viewer>(initialViewer);
    const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
        onCompleted: (data) => {
            if (data && data.logIn) {
                setViewer(data.logIn);

                if (data.logIn.token) {
                    sessionStorage.setItem('token', data.logIn.token);
                } else {
                    sessionStorage.removeItem('token');
                }
            }
        },
    });
    const loginRef = useRef(logIn);

    useEffect(() => {
        loginRef.current();
    }, []);

    if (!viewer.didRequest && !error) {
        return (
            <Layout className="app-skeleton">
                <AppHeaderSkeleton />
                <div className="app-skeleton__spin-section">
                    <Spin size="large" tip="Launching TinyHouse" />
                </div>
            </Layout>
        );
    }

    const logInErrorBannerElement = error ? (
        <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
    ) : null;

    return (
        <Router>
            <Layout id="app">
                {logInErrorBannerElement}
                <Affix offsetTop={0}>
                    <AppHeader viewer={viewer} setViewer={setViewer} />
                </Affix>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/host" component={Host} />
                    <Route exact path="/listing/:id" component={Listing} />
                    <Route exact path="/listings/:location?" component={Listings} />
                    <Route exact path="/login" render={(props) => <Login {...props} setViewer={setViewer} />} />
                    <Route exact path="/user/:id" render={(props) => <User {...props} viewer={viewer} />} />
                    <Route component={NotFound} />
                </Switch>
            </Layout>
        </Router>
    );
};
