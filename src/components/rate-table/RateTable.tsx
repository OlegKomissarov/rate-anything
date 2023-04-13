import React, { useState } from 'react';
import { trpc } from '../../utils/trpcClient';
import Table from '../elements/Table';
import { flattenInfiniteData, getClassName, Searching, Sorting, useDebouncedValue } from '../../utils/utils';
import { AverageRate, Rate } from '@prisma/client';
import RateDetailModal from './RateDetailModal';
import { useSession } from 'next-auth/react';

const RateTable: React.FC<{
    changeSubject: (rate: string) => void
}> = ({ changeSubject }) => {
    const { data: session } = useSession();

    const [sorting, setSorting] = useState<Sorting>({ field: 'subject', order: 'asc' });
    const [searching, setSearching] = useState<Searching>({ field: 'subject', fieldPreview: 'Subject', value: '' });
    const searchingValueDebounced = useDebouncedValue(searching.value, 500);

    const { data: averageRateList, fetchNextPage } = trpc.rate.getAverageRateList.useInfiniteQuery(
        {
            limit: 10,
            includePlainRates: true,
            sorting,
            searching: { field: 'subject', value: searchingValueDebounced }
        },
        { getNextPageParam: lastPage => lastPage.nextCursor, keepPreviousData: true }
    );

    const getIsRated = (averageRate: AverageRate & { rates: Rate[] }) =>
        averageRate.rates.some(rate => rate.userEmail === session?.user?.email);

    const fieldList = [
        {
            name: 'subject',
            previewName: 'Subject',
            render: (averageRate: AverageRate & { rates: Rate[] }) =>
                !getIsRated(averageRate)
                    ? <div className="rate-table__subject-item" onClick={() => changeSubject(averageRate.subject)}>
                        {averageRate.subject}
                    </div>
                    : averageRate.subject,
            bold: true,
            sortable: true,
            alignLeft: true
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
            render: (averageRate: AverageRate & { rates: Rate[] }) => <RateDetailModal averageRate={averageRate} />,
            bold: true,
            sortable: true
        },
        {
            name: 'isRated',
            previewName: 'Rated',
            render: (averageRate: AverageRate & { rates: Rate[] }) =>
                <div className={
                    getClassName(
                        'rate-table__is-rated',
                        getIsRated(averageRate) && 'check-icon rate-table__is-rated--rated'
                    )
                }
                />,
            bold: true
        }
    ];

    return <Table keyFieldName="subject"
                  className="rate-table"
                  data={flattenInfiniteData(averageRateList)}
                  fieldList={fieldList}
                  fetchNextPage={fetchNextPage}
                  sorting={sorting}
                  setSorting={setSorting}
                  searching={searching}
                  setSearching={setSearching}
    />;
};

export default RateTable;
