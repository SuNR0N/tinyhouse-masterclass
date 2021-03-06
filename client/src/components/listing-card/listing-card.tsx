import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { Listing } from '../../core/models/listing';
import { formatPrice, resolveRoute } from '../../core/utils';
import { AppRoute } from '../../core/config/app-route';
import './listing-card.scss';

const { Text, Title } = Typography;

interface Props {
    listing: Listing;
}

export const ListingCard: FC<Props> = ({ listing }) => {
    const { address, id, title, image, numOfGuests, price } = listing;

    return (
        <Link to={resolveRoute(AppRoute.LISTING, id)}>
            <Card hoverable cover={<div className="listing-card__cover-img" style={{ backgroundImage: `url(${image})` }} />}>
                <div className="listing-card__details">
                    <div className="listing-card__description">
                        <Title level={4} className="listing-card__price">
                            {formatPrice(price)}
                            <span>/day</span>
                        </Title>
                        <Text strong ellipsis className="listing-card__title">
                            {title}
                        </Text>
                        <Text ellipsis className="listing-card__address">
                            {address}
                        </Text>
                    </div>
                    <div className="listing-card__dimensions listing-card__dimensions--guests">
                        <UserOutlined className="icon--primary" />
                        <Text>{numOfGuests} guests</Text>
                    </div>
                </div>
            </Card>
        </Link>
    );
};
