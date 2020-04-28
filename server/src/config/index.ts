type CollectionKey = 'bookings' | 'listings' | 'users';

type CollectionMap = {
    [key in CollectionKey]: string;
};

interface Configuration {
    API_PREFIX: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    DB_CLUSTER: string;
    DB_COLLECTIONS: CollectionMap;
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_USER: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_GEOCODE_KEY: string;
    ENVIRONMENT: string;
    PORT: number;
    PUBLIC_URL: string;
    REQUEST_BODY_LIMIT: string;
    SECRET: string;
    STRIPE_CLIENT_ID: string;
    STRIPE_SECRET_KEY: string;
}

export const Configuration: Configuration = {
    API_PREFIX: '/api',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
    DB_CLUSTER: process.env.DB_CLUSTER || '',
    DB_COLLECTIONS: (process.env.DB_COLLECTIONS || '')
        .split(',')
        .map((pair) => pair.split('=') as [CollectionKey, string])
        .reduce<CollectionMap>(
            (acc, [key, value]) => {
                if (acc[key]) {
                    acc[key] = value;
                }
                return acc;
            },
            {
                bookings: 'bookings',
                listings: 'listings',
                users: 'users',
            }
        ),
    DB_NAME: process.env.DB_NAME || 'main',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_USER: process.env.DB_USER || '',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    GOOGLE_GEOCODE_KEY: process.env.GOOGLE_GEOCODE_KEY || '',
    ENVIRONMENT: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 9000,
    PUBLIC_URL: process.env.PUBLIC_URL || '',
    REQUEST_BODY_LIMIT: '2mb',
    SECRET: process.env.SECRET || '',
    STRIPE_CLIENT_ID: process.env.STRIPE_CLIENT_ID || '',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
};
