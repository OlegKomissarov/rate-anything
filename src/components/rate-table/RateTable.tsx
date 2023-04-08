import React, { useState } from 'react';
import { trpc } from '../../utils/trpcClient';
import Table from '../elements/Table';
import { flattenInfiniteData, useDebouncedValue } from '../../utils/utils';
import { AverageRate, Rate } from '@prisma/client';
import UserListModal from './UserListModal';

const RateTable: React.FC<{
    changeSubject: (rate: string) => void
}> = ({ changeSubject }) => {
    const [sorting, setSorting] = useState({ field: 'subject', order: 'asc' });
    const [searchingValue, setSearchingValue] = useState('');
    const searchingValueDebounced = useDebouncedValue(searchingValue, 500);

    const { data: averageRateList, fetchNextPage } = trpc.rate.getAverageRateList.useInfiniteQuery(
        {
            limit: 10,
            includePlainRates: true,
            sorting,
            searching: { field: 'subject', value: searchingValueDebounced }
        },
        { getNextPageParam: lastPage => lastPage.nextCursor, keepPreviousData: true }
    );

    const fieldList = [
        {
            name: 'subject',
            previewName: 'Subject',
            render: (averageRate: AverageRate & { rates: Rate[] }) =>
                <div className="rate-table__subject-item" onClick={() => changeSubject(averageRate.subject)}>
                    {averageRate.subject}
                </div>,
            bold: true,
            sortable: true
        },
        {
            name: 'averageRate',
            previewName: 'Rate',
            bold: true,
            sortable: true
        },
        {
            name: 'ratesAmount',
            previewName: 'Popularity',
            render: (averageRate: AverageRate & { rates: Rate[] }) => <UserListModal averageRate={averageRate} />,
            bold: true,
            sortable: true
        }
    ];

    return <>
        <Table keyFieldName="subject"
               className="rate-table"
               data={flattenInfiniteData(averageRateList)}
               fieldList={fieldList}
               fetchNextPage={fetchNextPage}
               sorting={sorting}
               setSorting={setSorting}
               searchingValue={searchingValue}
               setSearchingValue={setSearchingValue}
        />
    </>;
};

export default RateTable;
