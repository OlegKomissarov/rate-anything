import React, { useState } from 'react';
import { AverageRate, Rate } from '@prisma/client';
import { Searching, Sorting } from '../../utils/utils';
import Table from '../elements/Table';

const RateDetailModalContent: React.FC<{
    averageRate: AverageRate & { rates: Rate[] }
}> = ({ averageRate }) => {
    const [sorting, setSorting] = useState<Sorting>({ field: 'userName', order: 'asc' });
    const [searching, setSearching] = useState<Searching>({ field: 'userName', fieldPreview: 'User', value: '' });

    const fieldList = [
        {
            name: 'userName',
            previewName: 'User',
            bold: true,
            sortable: true,
            alignLeft: true
        },
        {
            name: 'rate',
            previewName: 'Rate',
            bold: true,
            sortable: true
        }
    ];

    const modifiedRateList = averageRate.rates
        .filter(rate => rate.userName.includes(searching.value))
        .sort((rateA, rateB) => {
            if (sorting.field === 'userName') {
                return sorting.order === 'asc'
                    ? rateA[sorting.field].localeCompare(rateB[sorting.field])
                    : rateB[sorting.field].localeCompare(rateA[sorting.field]);
            }
            if (sorting.field === 'rate') {
                return sorting.order === 'asc'
                    ? rateA[sorting.field] - rateB[sorting.field]
                    : rateB[sorting.field] - rateA[sorting.field];
            }
            return 0;
        });

    return <Table keyFieldName="id"
                  className="rate-detail-table"
                  data={modifiedRateList}
                  fieldList={fieldList}
                  sorting={sorting}
                  setSorting={setSorting}
                  searching={searching}
                  setSearching={setSearching}
    />;
};

export default RateDetailModalContent;
