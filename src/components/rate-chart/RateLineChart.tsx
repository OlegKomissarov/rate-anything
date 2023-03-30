import React from 'react';
import RateLineChartItem from './RateLineChartItem';
import { trpc } from '../../utils/trpcClient';

const RateLineChart: React.FC<{
    changeSubject: (subject: string) => void
}> = ({ changeSubject }) => {
    const { data: averageRateListResponse } = trpc.rate.getAverageRateList.useQuery({ limit: 500, includeRates: true });

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
            !!averageRateListResponse
            && averageRateListResponse?.data.map(averageRate =>
                <RateLineChartItem key={averageRate.subject}
                                   averageRate={averageRate}
                                   onClickRateItem={() => changeSubject(averageRate.subject)}
                />
            )
        }
    </div>;
};

export default RateLineChart;
