import React, { FC } from 'react';
import { Button, Divider, Modal, Typography } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { KeyOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { CREATE_BOOKING } from '../../../../core/graphql/mutations/create-booking';
import { CreateBooking as CreateBookingData, CreateBookingVariables } from '../../../../core/graphql/mutations/__generated__/CreateBooking';
import { formatPrice, displayErrorMessage, displaySuccessNotification } from '../../../../core/utils';
import './listing-create-booking-modal.scss';

const { Paragraph, Text, Title } = Typography;

interface Props {
    checkInDate: Moment;
    checkOutDate: Moment;
    clearBookingData: () => void;
    handleListingRefetch: () => Promise<void>;
    id: string;
    modalVisible: boolean;
    price: number;
    setModalVisible: (modalVisible: boolean) => void;
}

const DATE_FORMAT = 'MMMM Do YYYY';
const REQUEST_DATE_FORMAT = 'YYYY-MM-DD';

export const ListingCreateBookingModal: FC<Props> = ({
    checkInDate,
    checkOutDate,
    clearBookingData,
    handleListingRefetch,
    id,
    modalVisible,
    price,
    setModalVisible,
}) => {
    const [createBooking, { loading }] = useMutation<CreateBookingData, CreateBookingVariables>(CREATE_BOOKING, {
        onCompleted: () => {
            clearBookingData();
            displaySuccessNotification("You've successfully booked the listing!", 'Booking history can always be found in your User page.');
            handleListingRefetch();
        },
        onError: () => {
            displayErrorMessage("Sorry! We weren't able to successfully book the listing. Please try again later!");
        },
    });

    const stripe = useStripe();
    const elements = useElements();

    const daysBooked = checkOutDate.diff(checkInDate, 'days') + 1;
    const listingPrice = price * daysBooked;

    const handleCreateBooking = async () => {
        if (!stripe || !elements) {
            return displayErrorMessage("Sorry! We weren't able to connect with Stripe.");
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            return displayErrorMessage("Sorry! We couldn't resolve card information.");
        }

        const { token: stripeToken, error } = await stripe.createToken(cardElement);
        if (stripeToken) {
            createBooking({
                variables: {
                    input: {
                        checkIn: moment(checkInDate).format(REQUEST_DATE_FORMAT),
                        checkOut: moment(checkOutDate).format(REQUEST_DATE_FORMAT),
                        id,
                        source: stripeToken.id,
                    },
                },
            });
        } else {
            displayErrorMessage(
                error && error.message ? error.message : "Sorry! We weren't able to book the listing. Please try again later."
            );
        }
    };

    return (
        <Modal visible={modalVisible} centered footer={null} onCancel={() => setModalVisible(false)}>
            <div className="listing-create-booking-modal">
                <div className="listing-create-booking-modal__intro">
                    <Title className="listing-create-booking-modal__intro-title">
                        <KeyOutlined />
                    </Title>
                    <Title level={3} className="listing-create-booking-modal__intro-title">
                        Book your trip
                    </Title>
                    <Paragraph>
                        Enter your payment information to book the listing from the dates between{' '}
                        <Text mark strong>
                            {moment(checkInDate).format(DATE_FORMAT)}
                        </Text>{' '}
                        and{' '}
                        <Text mark strong>
                            {moment(checkOutDate).format(DATE_FORMAT)}
                        </Text>
                        , inclusive.
                    </Paragraph>
                </div>

                <Divider />

                <div className="listing-create-booking-modal__charge-summary">
                    <Paragraph>
                        {formatPrice(price, false)} * {daysBooked} days = <Text strong>{formatPrice(listingPrice, false)}</Text>
                    </Paragraph>
                    <Paragraph className="listing-create-booking-modal__charge-summary-total">
                        Total = <Text mark>{formatPrice(listingPrice, false)}</Text>
                    </Paragraph>
                </div>

                <Divider />

                <div className="listing-create-booking-modal__stripe-card-section">
                    <CardElement className="listing-create-booking-modal__stripe-card" options={{ hidePostalCode: true }} />
                    <Button
                        size="large"
                        type="primary"
                        className="listing-create-booking-modal__cta"
                        onClick={handleCreateBooking}
                        loading={loading}
                    >
                        Book
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
