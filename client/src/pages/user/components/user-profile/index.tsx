import React, { FC } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Avatar, Button, Card, Divider, Tag, Typography } from 'antd';

import { Configuration } from '../../../../core/config';
import { DISCONNECT_STRIPE } from '../../../../core/graphql/mutations/disconnect-stripe';
import { DisconnectStripe as DisconnectStripeData } from '../../../../core/graphql/mutations/__generated__/DisconnectStripe';
import { User as UserData } from '../../../../core/graphql/queries/__generated__/User';
import { formatPrice, displaySuccessNotification, displayErrorMessage } from '../../../../core/utils';
import { Viewer } from '../../../../core/models';
import './user-profile.scss';

const { Paragraph, Text, Title } = Typography;
const { STRIPE_AUTH_URL } = Configuration;

interface Props {
    handleUserRefetch: () => void;
    setViewer: (viewer: Viewer) => void;
    user: UserData['user'];
    viewer: Viewer;
    viewerIsUser: boolean;
}

export const UserProfile: FC<Props> = ({ handleUserRefetch, setViewer, user, viewer, viewerIsUser }) => {
    const [disconnectStripe, { loading }] = useMutation<DisconnectStripeData>(DISCONNECT_STRIPE, {
        onCompleted: (data) => {
            if (data && data.disconnectStripe) {
                setViewer({ ...viewer, hasWallet: data.disconnectStripe.hasWallet });
                displaySuccessNotification(
                    "You've successfully disconnected from Stripe!",
                    "You'll have to reconnect with Stripe to continue to create listings."
                );
                handleUserRefetch();
            }
        },
        onError: () => {
            displayErrorMessage("Sorry! We weren't able to disconnect your from Stripe. Please try again later!");
        },
    });

    const handleDisconnect = () => {
        disconnectStripe();
    };

    const redirectToStripe = () => {
        window.location.href = STRIPE_AUTH_URL;
    };

    const additionalDetails = user.hasWallet ? (
        <>
            <Paragraph>
                <Tag color="green">Stripe Registered</Tag>
            </Paragraph>
            <Paragraph>
                Income Earned: <Text strong>{user.income ? formatPrice(user.income) : '£0'}</Text>
            </Paragraph>
            <Button type="primary" className="user-profile__details-cta" loading={loading} onClick={handleDisconnect}>
                Disconnect Stripe
            </Button>
            <Paragraph type="secondary">
                By disconnecting, you won't be able to receive <Text strong>any further payments</Text>. This will prevent users from
                booking listings that you might have already created.
            </Paragraph>
        </>
    ) : (
        <>
            <Paragraph>Interested in becoming a TinyHouse host? Register with your Stripe account!</Paragraph>
            <Button type="primary" className="user-profile__details-cta" onClick={redirectToStripe}>
                Connect with Stripe
            </Button>
            <Paragraph type="secondary">
                TinyHouse uses{' '}
                <a href="https://stripe.com/en-US/connect" target="_blank" rel="noopener noreferrer">
                    Stripe
                </a>{' '}
                to help transfer your earnings in a secure and truster manner.
            </Paragraph>
        </>
    );

    const additionalDetailsSection = viewerIsUser ? (
        <>
            <Divider />
            <div className="user-profile__details">
                <Title level={4}>Additional Details</Title>
                {additionalDetails}
            </div>
        </>
    ) : null;

    return (
        <div className="user-profile">
            <Card className="user-profile__card">
                <div className="user-profile__avatar">
                    <Avatar size={100} src={user.avatar} />
                </div>
                <Divider />
                <div className="user-profile__details">
                    <Title level={4}>Details</Title>
                    <Paragraph>
                        Name: <Text strong>{user.name}</Text>
                    </Paragraph>
                    <Paragraph>
                        Contact: <Text strong>{user.contact}</Text>
                    </Paragraph>
                </div>
                {additionalDetailsSection}
            </Card>
        </div>
    );
};
