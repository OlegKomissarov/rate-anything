import React from 'react';
import RateLineChartItem from './RateLineChartItem';
import { getRatesOfSubject } from '../../utils/utils';
import { trpc } from '../../utils/trpcClient';

const RateLineChart: React.FC<{
    changeSubject: (subject: string) => void
}> = ({ changeSubject }) => {
    const { data: rateList } = trpc.rate.getRateList.useQuery();
    const { data: averageRateList } = trpc.rate.getAverageRateList.useQuery();

    return <div className="line-chart">
        <div className="line-chart__main-line" />
        {
            Array.from(Array(21).keys()).map((item, index) =>
                <React.Fragment key={index}>
                    <div className="line-chart__dash-dote" style={{ left: `${100 / 20 * index}%` }} />
                    <div className="line-chart__dash-label" style={{ left: `${100 / 20 * index}%` }}>
                        {+index - 10}
                    </div>
                </React.Fragment>
            )
        }
        {
            !!(averageRateList && rateList)
            && averageRateList.map(averageRate =>
                <RateLineChartItem key={averageRate.subject}
                                   averageRate={averageRate}
                                   onClickRateItem={() => changeSubject(averageRate.subject)}
                                   ratesOfSubject={getRatesOfSubject(rateList, averageRate.subject)}
                />
            )
        }
    </div>;
};

export default RateLineChart;
