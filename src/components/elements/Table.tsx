import React, { Dispatch, ReactNode, SetStateAction, useEffect } from 'react';
import { getClassName } from '../../utils/utils';
import { useInView } from 'react-intersection-observer';
import Input from './Input';

export type TableFieldList = {
    name: string
    previewName?: string
    render?: (item: any) => ReactNode
    bold?: boolean
    sortable?: boolean
}[];

const Table: React.FC<{
    fieldList: TableFieldList
    data?: any[]
    keyFieldName: string
    className?: string
    fetchNextPage?: () => void
    sorting?: { field: string, order: string }
    setSorting?: Dispatch<SetStateAction<{ field: string; order: string; }>>
    searchingValue?: string
    setSearchingValue?: Dispatch<SetStateAction<string>>
}> = ({
    fieldList, data, keyFieldName, className, fetchNextPage, sorting, setSorting, searchingValue,
    setSearchingValue
}) => {
    const { ref: inViewRef, inView } = useInView();

    useEffect(() => {
        if (inView && fetchNextPage) {
            fetchNextPage();
        }
    }, [inView]);

    return <div className={getClassName('table custom-scrollbar', className)}>
        <div className="table__sticky-header"
             style={{ gridColumnStart: 1, gridColumnEnd: fieldList.length + 1 }}
        >
            {
                setSearchingValue &&
                <Input value={searchingValue}
                       onChange={event => setSearchingValue(event.target.value)}
                       className="table__search-input"
                       placeholder="Search by subject"
                       style={{ gridColumnStart: 1, gridColumnEnd: fieldList.length + 1 }}
                />
            }
            {
                fieldList.map((field, index) =>
                    <div key={field.name}
                         className={
                             getClassName(
                                 'table__item table__item--header table__item--bold',
                                 index === 0 && 'table__item--first-column',
                                 index === fieldList.length - 1 && 'table__item--last-column',
                                 field.sortable && 'table__item--clickable'
                             )
                         }
                         onClick={
                             () => setSorting && field.sortable &&
                                 setSorting({
                                     field: field.name,
                                     order: (sorting?.field === field.name && sorting.order === 'asc') ? 'desc' : 'asc'
                                 })
                         }
                    >
                        <div className={
                            getClassName(
                                'table__item-text table__item-text--header',
                                field.sortable && sorting?.field !== field.name && 'table__item-text--with-gap-for-caret'
                            )
                        }
                        >
                            {field.previewName}
                        </div>
                        {
                            field.sortable && sorting?.field === field.name &&
                            (
                                sorting.order === 'asc'
                                    ? <div className="caret-icon caret-icon--up table__header-caret" />
                                    : <div className="caret-icon caret-icon--down table__header-caret" />
                            )
                        }
                    </div>
                )
            }
        </div>
        {
            !!data &&
            data.map(item =>
                fieldList.map((field, index) =>
                    <div key={item[keyFieldName] + field.name}
                         className={
                             getClassName(
                                 'table__item',
                                 field.bold && 'table__item--bold',
                                 index === 0 && 'table__item--first-column',
                                 index === fieldList.length - 1 && 'table__item--last-column',
                                 field.sortable && 'table__item-text--with-gap-for-caret'
                             )
                         }
                    >
                        {
                            field.render
                                ? field.render(item)
                                : item[field.name]
                        }
                    </div>
                )
            )
        }
        <div ref={inViewRef} />
    </div>;
};

export default Table;
