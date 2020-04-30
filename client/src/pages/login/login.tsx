import React, { FC, useEffect, useRef } from 'react';
import { Redirect } from 'react-router';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Card, Layout, Typography, Spin } from 'antd';

import { ErrorBanner } from '../../components/error-banner';
import { displayErrorMessage, displaySuccessNotification, resolveRoute } from '../../core/utils';
import { AUTH_URL } from '../../core/graphql/queries';
import { AuthUrl as AuthUrlData } from '../../core/graphql/queries/__generated__/AuthUrl';
import { LogIn as LogInData, LogInVariables } from '../../core/graphql/mutations/__generated__/LogIn';
import googleLogo from '../../assets/google_logo.png';
import { LOG_IN } from '../../core/graphql/mutations';
import { AppRoute } from '../../core/config/app-route';
import { useScrollToTop } from '../../core/hooks/use-scroll-to-top';
import { useViewerContext } from '../../core/contexts/viewer-context';
import './login.scss';

const { Content } = Layout;
const { Text, Title } = Typography;

export const Login: FC = () => {
    useScrollToTop();

    const { setViewer } = useViewerContext();
    const client = useApolloClient();
    const [logIn, { data: logInData, loading: logInLoading, error: logInError }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
        onCompleted: (data) => {
            if (data && data.logIn) {
                setViewer(data.logIn);
                if (data.logIn.token) {
                    sessionStorage.setItem('token', data.logIn.token);
                } else {
                    sessionStorage.removeItem('token');
                }
                displaySuccessNotification("You've successfully logged in!");
            }
        },
    });
    const logInRef = useRef(logIn);

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get('code');

        if (code) {
            logInRef.current({
                variables: {
                    input: { code },
                },
            });
        }
    }, []);

    const handleAuthorize = async () => {
        try {
            const {
                data: { authUrl },
            } = await client.query<AuthUrlData>({
                query: AUTH_URL,
            });
            window.location.href = authUrl;
        } catch (err) {
            displayErrorMessage("Sorry! We weren't able to log you in. Please try again later!");
        }
    };

    if (logInLoading) {
        return (
            <Content className="login">
                <Spin size="large" tip="Logging you in..." />
            </Content>
        );
    }

    if (logInData && logInData.logIn) {
        const { id: viewerId } = logInData.logIn;
        return <Redirect to={resolveRoute(AppRoute.USER, viewerId)} />;
    }

    const logInErrorBannerElement = logInError ? (
        <ErrorBanner description="Sorry! We weren't able to log you in. Please try again later!" />
    ) : null;

    return (
        <Content className="login">
            {logInErrorBannerElement}
            <Card className="login-card">
                <div className="login-card__intro">
                    <Title level={3} className="login-card__intro-title">
                        <span role="img" aria-label="wave">
                            👋
                        </span>
                    </Title>
                    <Title level={3} className="login-card__intro-title">
                        Log in to TinyHouse!
                    </Title>
                    <Text>Sign in with Google to start booking available rentals!</Text>
                </div>
                <button className="login-card__google-button" onClick={handleAuthorize}>
                    <img src={googleLogo} alt="Google Logo" className="login-card__google-button-logo" />
                    <span className="login-card__google-button-text">Sign in with Google</span>
                </button>
                <Text type="secondary">
                    Note: By signing in, you'll be redirected to the Google consent form to sign in with your Google account.
                </Text>
            </Card>
        </Content>
    );
};
