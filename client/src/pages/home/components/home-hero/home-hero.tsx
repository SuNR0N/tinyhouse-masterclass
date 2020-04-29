import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Input, Row, Typography } from 'antd';

import torontoImage from '../../../../assets/toronto.jpg';
import dubaiImage from '../../../../assets/dubai.jpg';
import losAngelesImage from '../../../../assets/los-angeles.jpg';
import londonImage from '../../../../assets/london.jpg';
import { AppRoute } from '../../../../core/config/app-route';
import { resolveRoute } from '../../../../core/utils';
import './home-hero.scss';

const { Title } = Typography;
const { Search } = Input;

interface Props {
    onSearch: (value: string) => void;
}

export const HomeHero: FC<Props> = ({ onSearch }) => (
    <div className="home-hero">
        <div className="home-hero__search">
            <Title className="home-hero__title">Find a place you'll love to stay at</Title>
            <Search placeholder="Search 'San Francisco'" size="large" enterButton className="home-hero__search-input" onSearch={onSearch} />
        </div>
        <Row gutter={12} className="home-hero__cards">
            <Col xs={12} md={6}>
                <Link to={resolveRoute(AppRoute.LISTINGS, 'Toronto')}>
                    <Card cover={<img alt="Toronto" src={torontoImage} />}>Toronto</Card>
                </Link>
            </Col>
            <Col xs={12} md={6}>
                <Link to={resolveRoute(AppRoute.LISTINGS, 'Dubai')}>
                    <Card cover={<img alt="Dubai" src={dubaiImage} />}>Dubai</Card>
                </Link>
            </Col>
            <Col xs={0} md={6}>
                <Link to={resolveRoute(AppRoute.LISTINGS, 'Los Angeles')}>
                    <Card cover={<img alt="Los Angeles" src={losAngelesImage} />}>Los Angeles</Card>
                </Link>
            </Col>
            <Col xs={0} md={6}>
                <Link to={resolveRoute(AppRoute.LISTINGS, 'London')}>
                    <Card cover={<img alt="London" src={londonImage} />}>London</Card>
                </Link>
            </Col>
        </Row>
    </div>
);
