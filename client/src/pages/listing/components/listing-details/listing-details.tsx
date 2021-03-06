import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Divider, Tag, Typography } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

import { Listing as ListingData } from '../../../../core/graphql/queries/__generated__/Listing';
import { resolveRoute } from '../../../../core/utils';
import { AppRoute } from '../../../../core/config/app-route';
import './listing-details.scss';

const { Paragraph, Title } = Typography;

interface Props {
    listing: ListingData['listing'];
}

export const ListingDetails: FC<Props> = ({ listing }) => {
    const { address, city, description, host, image, numOfGuests, title, type } = listing;

    return (
        <div className="listing-details">
            <div style={{ backgroundImage: `url(${image})` }} className="listing-details__image" />

            <div className="listing-details__information">
                <Paragraph type="secondary" ellipsis className="listing-details__city-address">
                    <Link to={resolveRoute(AppRoute.LISTINGS, city)}>
                        <EnvironmentOutlined className="icon--primary" /> {city}
                    </Link>
                    <Divider type="vertical" />
                    {address}
                </Paragraph>
                <Title level={3} className="listing-details__title">
                    {title}
                </Title>
            </div>

            <Divider />

            <div className="listing-details__section">
                <Link to={resolveRoute(AppRoute.USER, host.id)}>
                    <Avatar src={host.avatar} size={64} />
                    <Title level={2} className="listing-details__host-name">
                        {host.name}
                    </Title>
                </Link>
            </div>

            <Divider />

            <div className="listing-details__section">
                <Title level={4}>About this space</Title>
                <div className="listing-details__about-items">
                    <Tag color="magenta">{type}</Tag>
                    <Tag color="magenta">{numOfGuests} Guests</Tag>
                </div>
                <Paragraph ellipsis={{ rows: 3, expandable: true }}>{description}</Paragraph>
            </div>
        </div>
    );
};
