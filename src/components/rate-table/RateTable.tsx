import React, { useEffect } from 'react';
import { trpc } from '../../utils/trpcClient';
import { useInView } from 'react-intersection-observer';

const RateTable = () => {
    const { ref: inViewRef, inView } = useInView();

    const { data: averageRateList, fetchNextPage } = trpc.rate.getAverageRateList.useInfiniteQuery(
        { limit: 10, includeRates: true },
        { getNextPageParam: lastPage => lastPage.nextCursor }
    );

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    return <div className="rate-table custom-scrollbar">
        {
            !!averageRateList
            && averageRateList.pages.map(page =>
                <React.Fragment key={page.nextCursor || -1}>
                    {
                        page.data.map(averageRate =>
                            <React.Fragment key={averageRate.subject}>
                                <div className="rate-table__item rate-table__item--name">
                                    {averageRate.subject}
                                </div>
                                <div className="rate-table__item rate-table__item--rate">
                                    {averageRate.averageRate}
                                </div>
                                <div className="rate-table__item rate-table__item--users">
                                    {
                                        averageRate.rates.map(rate =>
                                            <div key={rate.userEmail}>{rate.userName}</div>
                                        )
                                    }
                                </div>
                            </React.Fragment>
                        )
                    }
                </React.Fragment>
            )
        }
        <div ref={inViewRef} />
    </div>;
};

export default RateTable;
