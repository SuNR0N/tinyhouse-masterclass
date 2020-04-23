import React, { FC } from 'react';
import { Button, Card, DatePicker, Divider, Typography } from 'antd';
import moment, { Moment } from 'moment';

import { formatPrice, displayErrorMessage } from '../../../../core/utils';
import './listing-create-booking.scss';

const { Paragraph, Title } = Typography;

interface Props {
    checkInDate: Moment | null;
    checkOutDate: Moment | null;
    price: number;
    setCheckInDate: (checkInDate: Moment | null) => void;
    setCheckOutDate: (checkOutDate: Moment | null) => void;
}

const DATE_PICKER_FORMAT = 'YYYY/MM/DD';

export const ListingCreateBooking: FC<Props> = ({ checkInDate, checkOutDate, price, setCheckInDate, setCheckOutDate }) => {
    console.log(checkInDate, checkOutDate);

    const disabledDate = (currentDate?: Moment) => {
        if (currentDate) {
            return currentDate.isBefore(moment().endOf('day'));
        } else {
            return false;
        }
    };

    const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
        if (checkInDate && selectedCheckOutDate) {
            if (moment(selectedCheckOutDate).isBefore(checkInDate, 'days')) {
                return displayErrorMessage("You can't book date of check out to be prior to check in!");
            }
        }

        setCheckOutDate(selectedCheckOutDate);
    };

    const checkOutInputDisabled = !checkInDate;
    const buttonDisabled = !checkInDate || !checkOutDate;

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
                            value={checkInDate ? checkInDate : undefined}
                            format={DATE_PICKER_FORMAT}
                            showToday={false}
                            disabledDate={disabledDate}
                            onChange={(dateValue) => setCheckInDate(dateValue)}
                            onOpenChange={() => setCheckOutDate(null)}
                        />
                    </div>
                    <div className="listing-create-booking__card-date-picker">
                        <Paragraph strong>Check Out</Paragraph>
                        <DatePicker
                            value={checkOutDate ? checkOutDate : undefined}
                            format={DATE_PICKER_FORMAT}
                            showToday={false}
                            disabled={checkOutInputDisabled}
                            disabledDate={disabledDate}
                            onChange={(dateValue) => verifyAndSetCheckOutDate(dateValue)}
                        />
                    </div>
                </div>
                <Divider />
                <Button size="large" type="primary" className="listing-create-booking__card-cta" disabled={buttonDisabled}>
                    Request to book!
                </Button>
            </Card>
        </div>
    );
};
