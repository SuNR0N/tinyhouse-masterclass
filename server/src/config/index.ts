interface Configuration {
    API_PREFIX: string;
    ENVIRONMENT: string;
    PORT: number;
}

export const Configuration: Configuration = {
    API_PREFIX: '/api',
    ENVIRONMENT: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 9000,
};
