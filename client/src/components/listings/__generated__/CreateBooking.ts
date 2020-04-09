/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateBooking
// ====================================================

export interface CreateBooking_createBooking {
  __typename: "Booking";
  id: string;
}

export interface CreateBooking {
  createBooking: CreateBooking_createBooking;
}

export interface CreateBookingVariables {
  id: string;
  timestamp: string;
}
