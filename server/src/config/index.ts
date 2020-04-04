interface Configuration {
    API_PREFIX: string;
    DB_CLUSTER: string;
    DB_COLLECTION_NAME: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_USER: string;
    ENVIRONMENT: string;
    PORT: number;
}

export const Configuration: Configuration = {
    API_PREFIX: '/api',
    DB_CLUSTER: process.env.DB_CLUSTER || '',
    DB_COLLECTION_NAME: process.env.DB_COLLECTION_NAME || 'test_listings',
    DB_NAME: process.env.DB_NAME || 'main',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_USER: process.env.DB_USER || '',
    ENVIRONMENT: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 9000,
};
