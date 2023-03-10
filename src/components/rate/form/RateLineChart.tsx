import React from 'react';
import RateLineChartItem from './RateLineChartItem';
import { getRatesOfSubject, Rate } from '../rateUtils';

const RateLineChart: React.FC<{
    rates: Rate[]
    averageRates: Rate[]
    changeSubject: (subject: string) => void
}> = ({ rates, averageRates, changeSubject }) => {
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
            averageRates.map(averageRate =>
                <RateLineChartItem key={averageRate.subject}
                                   averageRate={averageRate}
                                   onClickRateItem={() => changeSubject(averageRate.subject)}
                                   ratesOfSubject={getRatesOfSubject(rates, averageRate.subject)}
                />
            )
        }
    </div>;
};

export default RateLineChart;
