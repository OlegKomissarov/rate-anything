import React, { useState } from 'react';
import { AverageRate, Rate } from '@prisma/client';
import { useGetIsSubjectRated } from '../../utils/utils';
import Table, { TableSorting, TableSearching } from '../elements/Table';
import Button from '../elements/Button';

type RateDetailModalContentProps = {
    averageRate: AverageRate & { rates: Rate[] }
    toggleModal: () => void
    selectSubjectToRateForm: (rate: string) => void
};

const RateDetailModalContent = ({ averageRate, toggleModal, selectSubjectToRateForm }: RateDetailModalContentProps) => {
    const [sorting, setSorting] = useState<TableSorting>({ field: 'userName', order: 'asc' });
    const [searching, setSearching] = useState<TableSearching>({ field: 'userName', fieldPreview: 'User', value: '' });

    const getIsSubjectRated = useGetIsSubjectRated();

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

    return <Table keyFieldName="id"
                  className="rate-detail-table"
                  data={modifiedRateList}
                  fieldList={fieldList}
                  sorting={sorting}
                  setSorting={setSorting}
                  searching={searching}
                  setSearching={setSearching}
                  topPanelContent={
                      !getIsSubjectRated(averageRate) &&
                      <Button className="rate-detail-table__button"
                              onClick={() => {
                                  selectSubjectToRateForm(averageRate.subject);
                                  toggleModal();
                              }}
                      >
                          Rate {averageRate.subject}
                      </Button>
                  }
    />;
};

export default RateDetailModalContent;
