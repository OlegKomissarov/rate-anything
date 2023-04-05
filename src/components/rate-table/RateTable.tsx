import React from 'react';
import { trpc } from '../../utils/trpcClient';
import Table from '../elements/Table';
import { flattenInfiniteData } from '../../utils/utils';
import { AverageRate, Rate } from '@prisma/client';
import UserListModal from './UserListModal';

const RateTable = () => {
    const { data: averageRateList, fetchNextPage } = trpc.rate.getAverageRateList.useInfiniteQuery(
        { limit: 10, includePlainRates: true },
        { getNextPageParam: lastPage => lastPage.nextCursor }
    );

    const fieldList = [
        {
            name: 'subject',
            previewName: 'Subject',
            bold: true
        },
        {
            name: 'averageRate',
            previewName: 'Rate',
            bold: true
        },
        {
            name: 'rates',
            previewName: 'Details',
            render: (averageRate: AverageRate & { rates: Rate[] }) => <UserListModal averageRate={averageRate} />
        }
    ];

    return <>
        <Table keyFieldName="subject"
               className="rate-table"
               data={flattenInfiniteData(averageRateList)}
               fieldList={fieldList}
               fetchNextPage={fetchNextPage}
        />
    </>;
};

export default RateTable;
