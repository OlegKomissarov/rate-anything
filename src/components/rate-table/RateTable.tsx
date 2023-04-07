import React, { useState } from 'react';
import { trpc } from '../../utils/trpcClient';
import Table from '../elements/Table';
import { flattenInfiniteData } from '../../utils/utils';
import { AverageRate, Rate } from '@prisma/client';
import UserListModal from './UserListModal';

const RateTable = () => {
    const [sorting, setSorting] = useState({ field: 'subject', order: 'asc' });
    const { data: averageRateList, fetchNextPage } = trpc.rate.getAverageRateList.useInfiniteQuery(
        { limit: 10, includePlainRates: true, sorting },
        { getNextPageParam: lastPage => lastPage.nextCursor, keepPreviousData : true }
    );

    const fieldList = [
        {
            name: 'subject',
            previewName: 'Subject',
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
        />
    </>;
};

export default RateTable;
