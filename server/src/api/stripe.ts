import StripeLib from 'stripe';

import { Configuration } from '../config';

const { STRIPE_SECRET_KEY } = Configuration;

const client = new StripeLib(STRIPE_SECRET_KEY, { apiVersion: '2020-03-02' });

export const Stripe = {
    connect: async (code: string) => {
        return await client.oauth.token({
            code,
            /* eslint-disable-next-line @typescript-eslint/camelcase */
            grant_type: 'authorization_code',
        });
    },
};
