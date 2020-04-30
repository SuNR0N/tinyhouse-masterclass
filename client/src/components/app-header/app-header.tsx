import React, { FC, PropsWithChildren, forwardRef, useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Input, Layout } from 'antd';

import { Menu } from './menu';
import { AppRoute } from '../../core/config/app-route';
import { displayErrorMessage, resolveRoute } from '../../core/utils';
import logo from '../../assets/tinyhouse-logo.png';
import './app-header.scss';

const { Header } = Layout;
const { Search } = Input;

export const AppHeader: FC = forwardRef<{}, PropsWithChildren<{}>>(() => {
    const location = useLocation();
    const history = useHistory();
    const [search, setSearch] = useState('');

    useEffect(() => {
        const { pathname } = location;

        if (!pathname.includes('/listings')) {
            setSearch('');
        } else {
            const param = pathname.split('/')[2];
            if (param) {
                setSearch(param);
            }
        }
    }, [location]);

    const onSearch = (value: string) => {
        const trimmedValue = value.trim();

        if (trimmedValue) {
            history.push(resolveRoute(AppRoute.LISTINGS, trimmedValue));
        } else {
            displayErrorMessage('Please enter a valid search!');
        }
    };

    return (
        <Header className="app-header">
            <div className="app-header__logo-search-section">
                <div className="app-header__logo">
                    <Link to={AppRoute.HOME}>
                        <img src={logo} alt="App logo" />
                    </Link>
                </div>
                <div className="app-header__search-input">
                    <Search
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search 'San Francisco'"
                        enterButton
                        onSearch={onSearch}
                    />
                </div>
            </div>
            <div className="app-header__menu-section">
                <Menu />
            </div>
        </Header>
    );
});

AppHeader.displayName = 'AppHeader';
