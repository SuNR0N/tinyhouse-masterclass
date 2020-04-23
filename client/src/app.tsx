import React, { FC, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Layout, Spin, Affix } from 'antd';

import { Viewer } from './core/models/viewer';
import { LogIn as LogInData, LogInVariables } from './core/graphql/mutations/__generated__/LogIn';
import { LOG_IN } from './core/graphql/mutations/log-in';
import { AppHeaderSkeleton, ErrorBanner, AppHeader } from './components';
import { Home, Host, Listing, Listings, Login, NotFound, Stripe, User } from './pages';
import { AppRoute } from './core/config/app-route';
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
                    <Route exact path={AppRoute.HOME} component={Home} />
                    <Route exact path={AppRoute.HOST} render={(props) => <Host {...props} viewer={viewer} />} />
                    <Route exact path={AppRoute.LISTING} component={Listing} />
                    <Route exact path={AppRoute.LISTINGS} component={Listings} />
                    <Route exact path={AppRoute.LOGIN} render={(props) => <Login {...props} setViewer={setViewer} />} />
                    <Route exact path={AppRoute.STRIPE} render={(props) => <Stripe {...props} setViewer={setViewer} viewer={viewer} />} />
                    <Route exact path={AppRoute.USER} render={(props) => <User {...props} setViewer={setViewer} viewer={viewer} />} />
                    <Route component={NotFound} />
                </Switch>
            </Layout>
        </Router>
    );
};
