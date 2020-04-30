import React, { FC } from 'react';
import { Button, Card, DatePicker, Divider, Tooltip, Typography } from 'antd';
import moment, { Moment } from 'moment';

import { Listing as ListingData } from '../../../../core/graphql/queries/__generated__/Listing';
import { displayErrorMessage, formatPrice, isBooked } from '../../../../core/utils';
import { BookingsIndex, Viewer } from '../../../../core/models';
import './listing-create-booking.scss';

const { Paragraph, Text, Title } = Typography;

interface Props {
    bookingsIndex: ListingData['listing']['bookingsIndex'];
    checkInDate: Moment | null;
    checkOutDate: Moment | null;
    host: ListingData['listing']['host'];
    price: number;
    setCheckInDate: (checkInDate: Moment | null) => void;
    setCheckOutDate: (checkOutDate: Moment | null) => void;
    setModalVisible: (modalVisible: boolean) => void;
    viewer: Viewer;
}

const DATE_PICKER_FORMAT = 'YYYY/MM/DD';
const MAX_DAYS_AHEAD = 90;

export const ListingCreateBooking: FC<Props> = ({
    bookingsIndex,
    checkInDate,
    checkOutDate,
    host,
    price,
    setCheckInDate,
    setCheckOutDate,
    setModalVisible,
    viewer,
}) => {
    const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);

    const disabledDate = (currentDate?: Moment) => {
        if (currentDate) {
            const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf('day'));
            const dateIsMoreThanMaxDaysAhead = moment(currentDate).isAfter(moment().endOf('day').add(MAX_DAYS_AHEAD, 'days'));

            return dateIsBeforeEndOfDay || dateIsMoreThanMaxDaysAhead || isBooked(currentDate, bookingsIndexJSON);
        } else {
            return false;
        }
    };

    const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
        if (checkInDate && selectedCheckOutDate) {
            if (moment(selectedCheckOutDate).isBefore(checkInDate, 'days')) {
                return displayErrorMessage("You can't book date of check out to be prior to check in!");
            }

            let dateCursor = checkInDate;

            while (moment(dateCursor).isBefore(selectedCheckOutDate, 'days')) {
                dateCursor = moment(dateCursor).add(1, 'days');

                const year = moment(dateCursor).year();
                const month = moment(dateCursor).month();
                const day = moment(dateCursor).date();

                if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month] && bookingsIndexJSON[year][month][day]) {
                    return displayErrorMessage("You can't book a period of time that overlaps existing bookings. Please try again!");
                }
            }
        }

        setCheckOutDate(selectedCheckOutDate);
    };

    const viewerIsHost = viewer.id === host.id;
    const checkInInputDisabled = !viewer.id || viewerIsHost || !host.hasWallet;
    const checkOutInputDisabled = checkInInputDisabled || !checkInDate;
    const buttonDisabled = checkOutInputDisabled || !checkInDate || !checkOutDate;

    let buttonMessage = "You won't be charged yet";
    if (!viewer.id) {
        buttonMessage = 'You have to be signed in to book a listing!';
    } else if (viewerIsHost) {
        buttonMessage = "You can't book your own listing!";
    } else if (!host.hasWallet) {
        buttonMessage = "The host has disconnected from Stripe and thus won't be able to receive payments!";
    }

    return (
        <div className="listing-create-booking">
            <Card className="listing-create-booking__card">
                <div>
                    <Paragraph>
                        <Title level={2} className="listing-create-booking__card-title">
                            {formatPrice(price)}
                            <span>/day</span>
                        </Title>
                    </Paragraph>
                    <Divider />
                    <div className="listing-create-booking__card-date-picker">
                        <Paragraph strong>Check In</Paragraph>
                        <DatePicker
                            value={checkInDate}
                            format={DATE_PICKER_FORMAT}
                            showToday={false}
                            disabled={checkInInputDisabled}
                            disabledDate={disabledDate}
                            onChange={(dateValue) => setCheckInDate(dateValue)}
                            onOpenChange={() => setCheckOutDate(null)}
                            renderExtraFooter={() => (
                                <Text type="secondary" className="ant-picker-footer-text">
                                    You can only book a listing within {MAX_DAYS_AHEAD} days from today.
                                </Text>
                            )}
                        />
                    </div>
                    <div className="listing-create-booking__card-date-picker">
                        <Paragraph strong>Check Out</Paragraph>
                        <DatePicker
                            value={checkOutDate}
                            format={DATE_PICKER_FORMAT}
                            showToday={false}
                            disabled={checkOutInputDisabled}
                            disabledDate={disabledDate}
                            onChange={(dateValue) => verifyAndSetCheckOutDate(dateValue)}
                            dateRender={(current) => {
                                if (moment(current).isSame(checkInDate ? checkInDate : undefined, 'days')) {
                                    return (
                                        <Tooltip title="Check in date">
                                            <div className="ant-picker-cell-inner ant-picker-cell-inner__check-in">{current.date()}</div>
                                        </Tooltip>
                                    );
                                } else {
                                    return <div className="ant-picker-cell-inner">{current.date()}</div>;
                                }
                            }}
                            renderExtraFooter={() => (
                                <Text type="secondary" className="ant-picker-footer-text">
                                    Check-out cannot be before check-in.
                                </Text>
                            )}
                        />
                    </div>
                </div>
                <Divider />
                <Button
                    size="large"
                    type="primary"
                    className="listing-create-booking__card-cta"
                    disabled={buttonDisabled}
                    onClick={() => setModalVisible(true)}
                >
                    Request to book!
                </Button>
                <Text type="secondary" mark>
                    {buttonMessage}
                </Text>
            </Card>
        </div>
    );
};
