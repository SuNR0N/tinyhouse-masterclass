interface CreateBookingInput {
    checkIn: string;
    checkOut: string;
    id: string;
    source: string;
}

export interface CreateBookingsArgs {
    input: CreateBookingInput;
}
