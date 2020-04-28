import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button, Empty, Layout, Typography } from 'antd';

import { AppRoute } from '../../core/config/app-route';
import { useScrollToTop } from '../../core/hooks/use-scroll-to-top';
import './not-found.scss';

const { Content } = Layout;
const { Text } = Typography;

export const NotFound: FC = () => {
    useScrollToTop();

    return (
        <Content className="not-found">
            <Empty
                description={
                    <>
                        <Text className="not-found__description-title">Uh oh! Something went wrong :(</Text>
                        <Text className="not-found__description-subtitle">The page you're looking for can't be found</Text>
                    </>
                }
            />
            <Link to={AppRoute.HOME} className="not-found__cta">
                <Button size="large" type="primary">
                    Go to home
                </Button>
            </Link>
        </Content>
    );
};
