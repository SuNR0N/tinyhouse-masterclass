import React, { FC, Fragment } from 'react';
import { Alert, Divider, Skeleton } from 'antd';

import './listings-skeleton.scss';

interface Props {
    count?: number;
    error?: boolean;
    title: string;
}

export const ListingsSkeleton: FC<Props> = ({ count = 3, title, error = false }) => {
    const errorAlert = error ? (
        <Alert type="error" message="Uh oh! Something went wrong - please try again later :(" className="listings-skeleton__alert" />
    ) : null;

    return (
        <div className="listings-skeleton">
            {errorAlert}
            <h2>{title}</h2>
            {Array.from({ length: count }).map((_, i, arr) => (
                <Fragment key={i}>
                    <Skeleton active paragraph={{ rows: 1 }} />
                    {i < arr.length - 1 && <Divider />}
                </Fragment>
            ))}
        </div>
    );
};
