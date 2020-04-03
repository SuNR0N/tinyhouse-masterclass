interface Configuration {
    ENVIRONMENT: string;
    PORT: number;
}

export const Configuration: Configuration = {
    ENVIRONMENT: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 9000,
};
