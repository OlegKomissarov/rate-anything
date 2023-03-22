import React from 'react';
import { getRatesOfSubject } from '../../utils/utils';
import { trpc } from '../../utils/trpcClient';

const RateTable = () => {
    const { data: rateList } = trpc.rate.getRateList.useQuery();
    const { data: averageRateList } = trpc.rate.getAverageRateList.useQuery();

    return <div className="rate-table">
        {
            !!(averageRateList && rateList)
            && averageRateList.map(averageRate =>
                <div className="rate-table__row" key={averageRate.subject}>
                    <div className="rate-table__item rate-table__item--name">
                        {averageRate.subject}
                    </div>
                    <div className="rate-table__item rate-table__item--rate">
                        {averageRate.rate}
                    </div>
                    <div className="rate-table__item rate-table__item--users">
                        {getRatesOfSubject(rateList, averageRate.subject).map(rate =>
                            <div key={rate.useremail}>{rate.username}</div>
                        )}
                    </div>
                </div>
            )
        }
    </div>;
};

export default RateTable;
