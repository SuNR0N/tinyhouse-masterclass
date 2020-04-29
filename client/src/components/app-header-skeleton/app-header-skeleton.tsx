import React, { FC } from 'react';
import { Layout } from 'antd';

import logo from '../../assets/tinyhouse-logo.png';
import './app-header-skeleton.scss';

const { Header } = Layout;

export const AppHeaderSkeleton: FC = () => (
    <Header className="app-header-skeleton">
        <div className="app-header-skeleton__logo-search-section">
            <div className="app-header-skeleton__logo">
                <img src={logo} alt="App logo" />
            </div>
        </div>
    </Header>
);
