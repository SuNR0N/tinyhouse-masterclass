export interface ConnectStripeArgs {
    input: { code: string };
}

export interface LogInArgs {
    input: { code: string } | null;
}
