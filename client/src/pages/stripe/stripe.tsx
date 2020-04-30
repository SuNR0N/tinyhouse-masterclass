import React, { FC, useEffect, useRef } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Layout, Spin } from 'antd';

import { CONNECT_STRIPE } from '../../core/graphql/mutations/connect-stripe';
import { ConnectStripe as ConnectStripeData, ConnectStripeVariables } from '../../core/graphql/mutations/__generated__/ConnectStripe';
import { resolveRoute, displaySuccessNotification } from '../../core/utils';
import { AppRoute } from '../../core/config/app-route';
import { useScrollToTop } from '../../core/hooks/use-scroll-to-top';
import { useViewerContext } from '../../core/contexts/viewer-context';
import './stripe.scss';

const { Content } = Layout;

export const Stripe: FC = () => {
    useScrollToTop();

    const { viewer, setViewer } = useViewerContext();
    const history = useHistory();
    const [connectStripe, { data, loading, error }] = useMutation<ConnectStripeData, ConnectStripeVariables>(CONNECT_STRIPE, {
        onCompleted: (data) => {
            setViewer({ ...viewer, hasWallet: data.connectStripe.hasWallet });
            displaySuccessNotification(
                "You've successfully connected your Stripe account!",
                'You can now begin to create listings in the Host page.'
            );
        },
    });
    const connectStripeRef = useRef(connectStripe);

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get('code');
        if (code) {
            connectStripeRef.current({ variables: { input: { code } } });
        } else {
            history.replace(AppRoute.LOGIN);
        }
    }, [history]);

    if (data && data.connectStripe) {
        return <Redirect to={resolveRoute(AppRoute.USER, viewer.id)} />;
    }

    if (loading) {
        return (
            <Content className="stripe">
                <Spin size="large" tip="Connecting your Stripe account..." />
            </Content>
        );
    }

    if (error) {
        return <Redirect to={resolveRoute(AppRoute.USER, `${viewer.id}?stripe_error=true`)} />;
    }

    return null;
};
