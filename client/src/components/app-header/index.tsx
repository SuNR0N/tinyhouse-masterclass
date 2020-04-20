import React, { FC, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';

import { Menu } from './menu';
import { Viewer } from '../../core/models/viewer';
import logo from '../../assets/tinyhouse-logo.png';
import { AppRoute } from '../../core/config/app-route';
import './app-header.scss';

const { Header } = Layout;

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

export const AppHeader: FC<Props> = forwardRef(({ viewer, setViewer }, _ref) => (
    <Header className="app-header">
        <div className="app-header__logo-search-section">
            <div className="app-header__logo">
                <Link to={AppRoute.HOME}>
                    <img src={logo} alt="App logo" />
                </Link>
            </div>
        </div>
        <div className="app-header__menu-section">
            <Menu viewer={viewer} setViewer={setViewer} />
        </div>
    </Header>
));
