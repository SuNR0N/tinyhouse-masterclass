import { google } from 'googleapis';

import { Configuration } from '../config';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, PUBLIC_URL } = Configuration;

const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, `${PUBLIC_URL}/login`);

export const Google = {
    authUrl: auth.generateAuthUrl({
        // eslint-disable-next-line @typescript-eslint/camelcase
        access_type: 'online',
        scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    }),
    logIn: async (code: string) => {
        const { tokens } = await auth.getToken(code);
        auth.setCredentials(tokens);

        const { data } = await google.people({ version: 'v1', auth }).people.get({
            resourceName: 'people/me',
            personFields: 'emailAddresses,names,photos',
        });

        return { user: data };
    },
};
