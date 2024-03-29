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
    sortable?: boolean,
    reverseSortingOrder?: boolean,
    alignLeft?: boolean
}[];

type TableProps = {
    fieldList: TableFieldList
    data?: any[]
    keyFieldName: string
    className?: string
    fetchNextPage?: () => Promise<{}>
    sorting?: TableSorting
    setSorting?: Dispatch<SetStateAction<TableSorting>>
    searching?: TableSearching
    setSearching?: Dispatch<SetStateAction<TableSearching>>
    topPanelContent?: ReactNode
    isLoading?: boolean
    isFetching?: boolean
    isError?: boolean
};

const Table = (
    {
        fieldList, data, keyFieldName, className, fetchNextPage, sorting, setSorting, searching, setSearching,
        topPanelContent, isLoading, isFetching, isError
    }: TableProps
) => {
    const scrollableElementRef = useDisableBodyScroll<HTMLDivElement>();

    const { ref: inViewRef, inView } = useInView();
    useEffect(() => {
        if (inView && fetchNextPage) {
            // for the cases when the data cannot fill all the height of the screen.
            const recursiveFetchUntilOverflow = () => fetchNextPage()
                .then(() => {
                    // wait the next tick to check if the data overflows the container.
                    setTimeout(() => {
                        if (
                            scrollableElementRef.current?.scrollHeight
                            && scrollableElementRef.current?.scrollHeight <= scrollableElementRef.current?.clientHeight
                        ) {
                            recursiveFetchUntilOverflow();
                        }
                    }, 0);
                });
            recursiveFetchUntilOverflow();
        }
    }, [inView, fetchNextPage]);

    return <div ref={scrollableElementRef}
                className={getClassName('table custom-scrollbar', className)}
    >
        {
            !!((searching && setSearching) || topPanelContent) &&
            <div className="table__top-panel-sticky-container">
                {
                    !!(searching && setSearching) &&
                    <Input value={searching.value}
                           onChange={event => {
                               scrollableElementRef.current?.scrollTo({ top: 0 });
                               setSearching({ ...searching, value: event.target.value });
                           }}
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
                     onClick={() => {
                         if (setSorting && field.sortable) {
                             scrollableElementRef.current?.scrollTo({ top: 0 });
                             let order: TableSorting['order'] = 'asc';
                             if (
                                 (sorting?.field === field.name && sorting.order === 'asc')
                                 || (sorting?.field !== field.name && field.reverseSortingOrder)
                             ) {
                                 order = 'desc';
                             }
                             setSorting({
                                 field: field.name,
                                 order: order
                             });
                         }
                     }}
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
                                    ? <div className="caret-icon caret-icon--down" />
                                    : <div className="caret-icon caret-icon--up" />
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
