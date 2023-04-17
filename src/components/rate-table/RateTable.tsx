import React, { useState } from 'react';
import { trpc } from '../../utils/trpcClient';
import Table, { TableFieldList, TableSearching, TableSorting } from '../elements/Table';
import {
    flattenInfiniteData, getClassName, isMobile, useDebouncedValue, useGetIsSubjectRated
} from '../../utils/utils';
import { AverageRate, Rate } from '@prisma/client';
import RateDetailModal from './RateDetailModal';

const RateTable: React.FC<{
    selectSubjectToRateForm: (rate: string) => void
}> = ({ selectSubjectToRateForm }) => {
    const [sorting, setSorting] = useState<TableSorting>({ field: 'subject', order: 'asc' });
    const [searching, setSearching] = useState<TableSearching>({ field: 'subject', fieldPreview: 'Subject', value: '' });
    const searchingValueDebounced = useDebouncedValue(searching.value);

    const {
        data: averageRateList,
        fetchNextPage,
        isLoading,
        isFetching,
        isError
    } = trpc.rate.getAverageRateList.useInfiniteQuery(
        {
            limit: 10,
            includePlainRates: true,
            sorting,
            searching: { field: 'subject', value: searchingValueDebounced }
        },
        {
            getNextPageParam: lastPage => lastPage.nextCursor,
            keepPreviousData: true
        }
    );

    const getIsSubjectRated = useGetIsSubjectRated();

    const fieldList: TableFieldList = [
        {
            name: 'subject',
            previewName: 'Subject',
            render: (averageRate: AverageRate & { rates: Rate[] }) =>
                !getIsSubjectRated(averageRate)
                    ? <div className="rate-table__subject-item"
                           onClick={() => selectSubjectToRateForm(averageRate.subject)}
                    >
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
            render: (averageRate: AverageRate & { rates: Rate[] }) =>
                <RateDetailModal averageRate={averageRate} selectSubjectToRateForm={selectSubjectToRateForm} />,
            bold: true,
            sortable: true
        }
    ];

    if (!isMobile()) {
        fieldList.push({
            name: 'isRated',
            previewName: 'Rated',
            render: (averageRate: AverageRate & { rates: Rate[] }) =>
                <div className={
                    getClassName(
                        'rate-table__is-rated',
                        getIsSubjectRated(averageRate) && 'check-icon rate-table__is-rated--rated'
                    )
                }
                />,
            bold: true
        });
    }

    return <Table keyFieldName="subject"
                  className="rate-table"
                  data={flattenInfiniteData(averageRateList)}
                  fieldList={fieldList}
                  fetchNextPage={fetchNextPage}
                  sorting={sorting}
                  setSorting={setSorting}
                  searching={searching}
                  setSearching={setSearching}
                  isLoading={isLoading}
                  isFetching={isFetching}
                  isError={isError}
    />;
};

export default RateTable;
