import React, { FC, Fragment, ReactNode } from 'react';
import { Alert, Avatar, Divider, List as ADList, Skeleton, Spin } from 'antd/es';

import './list.scss';

type ItemMetaMappingKey = 'title' | 'description' | 'avatar';

interface Props<T> {
    actionsRenderer?: (item: T) => ReactNode[] | undefined;
    className?: string;
    contentRenderer?: (item: T) => ReactNode[] | ReactNode | undefined;
    dataSource?: T[];
    errorMessage?: string;
    isLoading?: boolean;
    itemMetaMapping?: { [key in ItemMetaMappingKey]: keyof T };
    skeletonRowCount?: number;
    spinning?: boolean;
    title: string;
}

export const ListFactory = <T extends any>(): FC<Props<T>> => ({
    actionsRenderer,
    className = '',
    contentRenderer,
    dataSource,
    errorMessage,
    isLoading = false,
    itemMetaMapping = { title: 'title', avatar: 'image', description: 'address' },
    skeletonRowCount = 3,
    spinning = false,
    title,
}) => {
    const list = dataSource ? (
        <ADList
            itemLayout="horizontal"
            dataSource={dataSource}
            renderItem={(item) => (
                <ADList.Item actions={actionsRenderer && actionsRenderer(item)}>
                    <ADList.Item.Meta
                        title={item[itemMetaMapping.title]}
                        description={item[itemMetaMapping.description]}
                        avatar={<Avatar src={item[itemMetaMapping.avatar]} shape="square" size={48} />}
                    />
                    {contentRenderer && contentRenderer(item)}
                </ADList.Item>
            )}
        />
    ) : null;
    const skeleton = Array.from({ length: skeletonRowCount }).map((_, i, arr) => (
        <Fragment key={i}>
            <Skeleton active paragraph={{ rows: 1 }} />
            {i < arr.length - 1 && <Divider />}
        </Fragment>
    ));
    const classes = ['list', isLoading && 'list--skeleton', className].filter((c) => typeof c === 'string').join(' ');

    return (
        <div className={classes}>
            <Spin spinning={spinning}>
                {errorMessage && <Alert type="error" message={errorMessage} className="list__alert" />}
                <h2>{title}</h2>
                {isLoading ? skeleton : list}
            </Spin>
        </div>
    );
};
