import React, { FC, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Layout, Spin, Affix } from 'antd';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { Configuration } from './core/config';
import { Viewer } from './core/models/viewer';
import { LogIn as LogInData, LogInVariables } from './core/graphql/mutations/__generated__/LogIn';
import { LOG_IN } from './core/graphql/mutations/log-in';
import { AppHeaderSkeleton, ErrorBanner, AppHeader } from './components';
import { Home, Host, Listing, Listings, Login, NotFound, Stripe, User } from './pages';
import { AppRoute } from './core/config/app-route';
import { ViewerContextProvider } from './core/contexts/viewer-context';
import './app.scss';

const { STRIPE_PUBLISHABLE_KEY } = Configuration;
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

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
        <ViewerContextProvider value={{ viewer, setViewer }}>
            <Router>
                <Layout className="app">
                    {logInErrorBannerElement}
                    <Affix className="app__affix-header" offsetTop={0}>
                        <AppHeader />
                    </Affix>
                    <Switch>
                        <Route exact path={AppRoute.HOME} component={Home} />
                        <Route exact path={AppRoute.HOST} component={Host} />
                        <Route
                            exact
                            path={AppRoute.LISTING}
                            render={() => (
                                <Elements stripe={stripePromise}>
                                    <Listing />
                                </Elements>
                            )}
                        />
                        <Route exact path={AppRoute.LISTINGS} component={Listings} />
                        <Route exact path={AppRoute.LOGIN} component={Login} />
                        <Route exact path={AppRoute.STRIPE} component={Stripe} />
                        <Route exact path={AppRoute.USER} component={User} />
                        <Route component={NotFound} />
                    </Switch>
                </Layout>
            </Router>
        </ViewerContextProvider>
    );
};
