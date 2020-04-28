interface Configuration {
    STRIPE_AUTH_URL: string;
    STRIPE_PUBLISHABLE_KEY: string;
}

export const Configuration: Configuration = {
    STRIPE_AUTH_URL: `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=read_write`,
    STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '',
};
