import { google } from 'googleapis';
import { createClient, AddressComponent } from '@google/maps';

import { Configuration } from '../config';
import { Address } from '../types';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_GEOCODE_KEY, PUBLIC_URL } = Configuration;

const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, `${PUBLIC_URL}/login`);

const maps = createClient({ key: GOOGLE_GEOCODE_KEY, Promise });

const parseAddress = (addressComponents: AddressComponent[]) => {
    return addressComponents.reduce<Address>(
        (acc, component) => {
            if (component.types.includes('country')) {
                acc.country = component.long_name;
            }

            if (component.types.includes('administrative_area_level_1')) {
                acc.admin = component.long_name;
            }

            if (component.types.includes('locality') || component.types.includes('postal_town')) {
                acc.city = component.long_name;
            }

            return acc;
        },
        {
            admin: null,
            city: null,
            country: null,
        }
    );
};

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
    geocode: async (address: string) => {
        try {
            const response = await maps.geocode({ address }).asPromise();
            if (response.status < 200 || response.status > 299) {
                throw new Error('Failed to geocode address');
            }

            return parseAddress(response.json.results[0].address_components);
        } catch (err) {
            const msg = err.json?.error_message || err.message;
            throw new Error(`An error occurred during geocoding: ${msg}`);
        }
    },
};
