import React, { Dispatch, ReactNode, SetStateAction, useEffect } from 'react';
import { getClassName, isMobile, useDisableBodyScroll } from '../../utils/utils';
import { useInView } from 'react-intersection-observer';
import Input from './Input';
import BigLoader from '../layout/BigLoader';
import Loader from '../layout/Loader';

export type TableSorting = {
    field: string
    order: 'asc' | 'desc'
};

export type TableSearching = {
    field: string
    fieldPreview: string
    value: string
};

export type TableFieldList = {
    name: string
    previewName?: string
    render?: (item: any) => ReactNode
    bold?: boolean
    sortable?: boolean
    alignLeft?: boolean
}[];

const Table: React.FC<{
    fieldList: TableFieldList
    data?: any[]
    keyFieldName: string
    className?: string
    fetchNextPage?: () => void
    sorting?: TableSorting
    setSorting?: Dispatch<SetStateAction<TableSorting>>
    searching?: TableSearching
    setSearching?: Dispatch<SetStateAction<TableSearching>>
    topPanelContent?: ReactNode
    isLoading?: boolean
    isFetching?: boolean
    isError?: boolean
}> = ({
    fieldList, data, keyFieldName, className, fetchNextPage, sorting, setSorting, searching, setSearching,
    topPanelContent, isLoading, isFetching, isError
}) => {
    const scrollableElementRef = useDisableBodyScroll();

    const { ref: inViewRef, inView } = useInView();
    useEffect(() => {
        if (inView && fetchNextPage) {
            fetchNextPage();
        }
    }, [inView]);

    return <div className={getClassName('table custom-scrollbar', className)}
                ref={scrollableElementRef}
    >
        {
            !!((searching && setSearching) || topPanelContent) &&
            <div className="table__top-panel-sticky-container">
                {
                    !!(searching && setSearching) &&
                    <Input value={searching.value}
                           onChange={event => setSearching({ ...searching, value: event.target.value })}
                           className="table__search-input"
                           placeholder={`Search by ${searching.fieldPreview}`}
                    />
                }
                {topPanelContent}
                {
                    isFetching && !isLoading && !isMobile() &&
                    <Loader className="table__refetch-loader" />
                }
            </div>
        }
        {
            fieldList.map(field =>
                <div key={field.name}
                     className={
                         getClassName(
                             'table__item table__item--header table__item--bold',
                             field.sortable && 'table__item--clickable',
                             field.alignLeft && 'table__item--align-left'
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
                        <div className="table__header-caret">
                            {
                                sorting.order === 'asc'
                                    ? <div className="caret-icon caret-icon--up" />
                                    : <div className="caret-icon caret-icon--down" />
                            }
                        </div>
                    }
                </div>
            )
        }
        {
            !!data &&
            data.map(item =>
                fieldList.map(field =>
                    <div key={item[keyFieldName] + field.name}
                         className={
                             getClassName(
                                 'table__item',
                                 field.bold && 'table__item--bold',
                                 field.sortable && 'table__item-text--with-gap-for-caret',
                                 field.alignLeft && 'table__item--align-left'
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
        {
            data && !data.length &&
            <div className="table__empty-content-container secondary-text">No data found</div>
        }
        {
            isFetching && !isLoading && isMobile() &&
            <Loader />
        }
        {
            isLoading &&
            <BigLoader className="table__empty-content-container" />
        }
        {
            isError &&
            <div className="table__empty-content-container secondary-text">
                Error occurred while loading data
            </div>
        }
        <div ref={inViewRef} />
    </div>;
};

export default Table;
