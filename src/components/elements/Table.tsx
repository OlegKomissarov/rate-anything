import React, { ReactNode, useEffect } from 'react';
import { getClassName } from '../../utils/utils';
import { useInView } from 'react-intersection-observer';

export type TableFieldList = {
    name: string
    render?: (item: any) => ReactNode
    bold?: boolean
}[];

const Table: React.FC<{
    fieldList: TableFieldList
    data?: any[]
    keyFieldName: string
    className: string
    fetchNextPage: () => void
}> = ({ fieldList, data, keyFieldName, className, fetchNextPage }) => {
    const { ref: inViewRef, inView } = useInView();

    useEffect(() => {
        if (inView && fetchNextPage) {
            fetchNextPage();
        }
    }, [inView]);

    if (!data) {
        return null;
    }

    return <div className={getClassName('table custom-scrollbar', className)}>
        {
            data.map(item =>
                fieldList.map((field, index) =>
                    <div key={item[keyFieldName] + field.name}
                         className={
                             getClassName(
                                 'table__item',
                                 field.bold && 'table__item--bold',
                                 index === 0 && 'table__item--first-column',
                                 index === fieldList.length - 1 && 'table__item--last-column'
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
