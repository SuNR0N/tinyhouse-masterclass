import React, { FC } from 'react';
import { Alert } from 'antd';

import './error-banner.scss';

interface Props {
    message?: string;
    description?: string;
}

export const ErrorBanner: FC<Props> = ({
    message = 'Uh oh! Something went wrong :(',
    description = 'Look like something went wrong. Please check your connection and/or try again later',
}) => <Alert banner closable message={message} description={description} type="error" className="error-banner" />;
