import React, { FC } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { Button, Col, Layout, Row, Typography } from 'antd';

import { Listings as ListingsData, ListingsVariables } from '../../core/graphql/queries/__generated__/Listings';
import { ListingsFilter } from '../../core/graphql/globalTypes';
import { HomeHero, HomeListings, HomeListingsSkeleton } from './components';
import { displayErrorMessage, resolveRoute } from '../../core/utils';
import sanFranciscoImage from '../../assets/san-francisco.jpg';
import cancunImage from '../../assets/cancun.jpg';
import { AppRoute } from '../../core/config/app-route';
import { LISTINGS } from '../../core/graphql/queries';
import './home.scss';

const { Content } = Layout;
const { Paragraph, Title } = Typography;

const PAGE_LIMIT = 4;
const PAGE_NUMBER = 1;

export const Home: FC<RouteComponentProps> = ({ history }) => {
    const { loading, data } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
        variables: { filter: ListingsFilter.PRICE_HIGH_TO_LOW, limit: PAGE_LIMIT, page: PAGE_NUMBER },
        fetchPolicy: 'cache-and-network',
    });

    const onSearch = (value: string) => {
        const trimmedValue = value.trim();

        if (trimmedValue) {
            history.push(resolveRoute(AppRoute.LISTINGS, trimmedValue));
        } else {
            displayErrorMessage('Please enter a valid search!');
        }
    };

    const renderListingsSection = () => {
        if (loading) {
            return <HomeListingsSkeleton />;
        }

        if (data) {
            return <HomeListings title="Premium Listings" listings={data.listings.result} />;
        }

        return null;
    };

    return (
        <Content className="home">
            <HomeHero onSearch={onSearch} />

            <div className="home__cta-section">
                <Title level={2} className="home__cta-section-title">
                    Your guide for all things rental
                </Title>
                <Paragraph>Helping you make the best decisions in renting your last minute locations.</Paragraph>
                <Link to={resolveRoute(AppRoute.LISTINGS, 'United Kingdom')}>
                    <Button type="primary" size="large" className="home__cta-section-button">
                        Popular listings in the United Kingdom
                    </Button>
                </Link>
            </div>

            {renderListingsSection()}

            <div className="home__listings">
                <Title level={4} className="home__listings-title">
                    Listings of any kind
                </Title>
                <Row gutter={12}>
                    <Col xs={24} sm={12}>
                        <Link to={resolveRoute(AppRoute.LISTINGS, 'San Francisco')}>
                            <div className="home__listings-img-cover">
                                <img src={sanFranciscoImage} alt="San Francisco" className="home__listings-img" />
                            </div>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Link to={resolveRoute(AppRoute.LISTINGS, 'Cancún')}>
                            <div className="home__listings-img-cover">
                                <img src={cancunImage} alt="Cancún" className="home__listings-img" />
                            </div>
                        </Link>
                    </Col>
                </Row>
            </div>
        </Content>
    );
};
