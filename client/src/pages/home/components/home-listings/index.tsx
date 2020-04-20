import React, { FC } from 'react';
import { List, Typography } from 'antd';

import { ListingCard } from '../../../../components/listing-card';
import { Listings } from '../../../../core/graphql/queries/__generated__/Listings';
import './home-listings.scss';

const { Title } = Typography;

interface Props {
    title: string;
    listings: Listings['listings']['result'];
}

export const HomeListings: FC<Props> = ({ listings, title }) => (
    <div className="home-listings">
        <Title level={4} className="home-listings__title">
            {title}
        </Title>
        <List
            grid={{
                gutter: 8,
                xs: 1,
                sm: 2,
                lg: 4,
            }}
            dataSource={listings}
            renderItem={(listing) => (
                <List.Item>
                    <ListingCard listing={listing} />
                </List.Item>
            )}
        />
    </div>
);
