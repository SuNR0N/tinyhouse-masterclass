import React, { FC } from 'react';
import { Select } from 'antd';

import { ListingsFilter } from '../../../../core/graphql/globalTypes';
import './listings-filters.scss';

const { Option } = Select;

interface Props {
    filter: ListingsFilter;
    setFilter: (filter: ListingsFilter) => void;
}

export const ListingsFilters: FC<Props> = ({ filter, setFilter }) => (
    <div className="listings-filters">
        <span>Filter By</span>
        <Select value={filter} onChange={(filter) => setFilter(filter)}>
            <Option value={ListingsFilter.PRICE_LOW_TO_HIGH}>Price: Low to High</Option>
            <Option value={ListingsFilter.PRICE_HIGH_TO_LOW}>Price: High to Low</Option>
        </Select>
    </div>
);
