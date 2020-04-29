import React, { FC, forwardRef } from 'react';
import { Pagination } from 'antd';

import './listings-pagination.scss';

interface Props {
    limit: number;
    page: number;
    setPage: (page: number) => void;
    total: number;
}

export const ListingsPagination: FC<Props> = forwardRef(({ page, setPage, limit, total }, _ref) => (
    <Pagination
        className="listings-pagination"
        current={page}
        total={total}
        defaultPageSize={limit}
        hideOnSinglePage
        showLessItems
        onChange={(page) => setPage(page)}
    />
));
