import React, { FC } from 'react';
import { Card, List, Skeleton } from 'antd';

import listingLoadingCardCover from '../../../../assets/listing-loading-card-cover.png';
import './home-listings-skeleton.scss';

export const HomeListingsSkeleton: FC = () => {
    const emptyData = Array.from({ length: 4 }).fill({});

    return (
        <div className="home-listings-skeleton">
            <Skeleton paragraph={{ rows: 0 }} />
            <List
                grid={{
                    gutter: 8,
                    xs: 1,
                    sm: 2,
                    lg: 4,
                }}
                dataSource={emptyData}
                renderItem={() => (
                    <List.Item>
                        <Card
                            cover={
                                <div
                                    style={{ backgroundImage: `url(${listingLoadingCardCover})` }}
                                    className="home-listings-skeleton__card-cover-img"
                                />
                            }
                            loading
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};
