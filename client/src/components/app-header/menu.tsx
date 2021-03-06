import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Avatar, Button, Menu as ADMenu } from 'antd';
import { HomeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';

import { LOG_OUT } from '../../core/graphql/mutations';
import { LogOut as LogOutData } from '../../core/graphql/mutations/__generated__/LogOut';
import { displaySuccessNotification, displayErrorMessage, resolveRoute } from '../../core/utils';
import { AppRoute } from '../../core/config/app-route';
import { useViewerContext } from '../../core/contexts/viewer-context';
import './menu.scss';

const { Item, SubMenu } = ADMenu;

export const Menu: FC = () => {
    const { viewer, setViewer } = useViewerContext();
    const [logOut] = useMutation<LogOutData>(LOG_OUT, {
        onCompleted: (data) => {
            if (data && data.logOut) {
                setViewer(data.logOut);
                sessionStorage.removeItem('token');
                displaySuccessNotification("You've successfully logged out!");
            }
        },
        onError: () => {
            displayErrorMessage("Sorry! We weren't able to log you out. Please try again later!");
        },
    });

    const handleLogOut = () => {
        logOut();
    };

    const subMenuLogin =
        viewer.id && viewer.avatar ? (
            <SubMenu title={<Avatar src={viewer.avatar} />}>
                <Item key="/user">
                    <Link to={resolveRoute(AppRoute.USER, viewer.id)}>
                        <UserOutlined />
                        Profile
                    </Link>
                </Item>
                <Item key="/logout">
                    <div onClick={handleLogOut}>
                        <LogoutOutlined />
                        Log out
                    </div>
                </Item>
            </SubMenu>
        ) : (
            <Item>
                <Link to={AppRoute.LOGIN}>
                    <Button type="primary">Sign In</Button>
                </Link>
            </Item>
        );

    return (
        <ADMenu mode="horizontal" selectable={false} className="menu">
            <Item key="/host">
                <Link to={AppRoute.HOST}>
                    <HomeOutlined />
                    Host
                </Link>
            </Item>
            {subMenuLogin}
        </ADMenu>
    );
};
