import React, { FC } from 'react';
import { Skeleton } from 'antd';

import './page-skeleton.scss';

interface Props {
    paragraphs?: number;
    rowsPerParagraph?: number;
}

export const PageSkeleton: FC<Props> = ({ paragraphs = 3, rowsPerParagraph = 4 }) => (
    <>
        {Array.from({ length: paragraphs }).map((_, i) => (
            <Skeleton key={i} active paragraph={{ rows: rowsPerParagraph }} className="page-skeleton__paragraph" />
        ))}
    </>
);
