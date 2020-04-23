interface Configuration {
    STRIPE_AUTH_URL: string;
}

export const Configuration: Configuration = {
    STRIPE_AUTH_URL: `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=read_write`,
};
