import React from 'react';
import { trpc } from '../../utils/trpcClient';

const RateTable = () => {
    const { data: rateList } = trpc.rate.getRateList.useQuery();
    const { data: averageRateList } = trpc.rate.getAverageRateList.useQuery();

    return <div className="rate-table custom-scrollbar">
        {
            !!(averageRateList && rateList)
            && averageRateList.map(averageRate =>
                <React.Fragment key={averageRate.subject}>
                    <div className="rate-table__item rate-table__item--name">
                        {averageRate.subject}
                    </div>
                    <div className="rate-table__item rate-table__item--rate">
                        {averageRate.averageRate}
                    </div>
                    {/*<div className="rate-table__item rate-table__item--users">*/}
                    {/*    {getRatesOfSubject(rateList, averageRate.subject).map(rate =>*/}
                    {/*        <div key={rate.userEmail}>{rate.userName}</div>*/}
                    {/*    )}*/}
                    {/*</div>*/}
                </React.Fragment>
            )
        }
    </div>;
};

export default RateTable;
