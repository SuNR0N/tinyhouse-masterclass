import StripeLib from 'stripe';

import { Configuration } from '../config';

const { STRIPE_CLIENT_ID, STRIPE_SECRET_KEY } = Configuration;

const client = new StripeLib(STRIPE_SECRET_KEY, { apiVersion: '2020-03-02' });

export const Stripe = {
    charge: async (amount: number, source: string, stripeAccount: string) => {
        const result = await client.charges.create(
            {
                amount,
                currency: 'gbp',
                source,
                /* eslint-disable-next-line @typescript-eslint/camelcase */
                application_fee_amount: Math.round(amount * 0.05),
            },
            {
                stripeAccount,
            }
        );

        if (result.status !== 'succeeded') {
            throw new Error('Failed to create charge with Stripe');
        }
    },
    connect: async (code: string) => {
        return await client.oauth.token({
            code,
            /* eslint-disable-next-line @typescript-eslint/camelcase */
            grant_type: 'authorization_code',
        });
    },
    disconnect: async (stripeUserId: string) => {
        return await client.oauth.deauthorize({
            /* eslint-disable @typescript-eslint/camelcase */
            client_id: STRIPE_CLIENT_ID,
            stripe_user_id: stripeUserId,
            /* eslint-enable @typescript-eslint/camelcase */
        });
    },
};
