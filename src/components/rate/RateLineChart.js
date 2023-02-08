import React from 'react';
import RateItem from './RateItem';

const RateLineChart = props => {
    const { rates, changeSubject } = props;

    return <div className="line-chart">
        <div className="line-chart__main-line" />
        {
            Array.from(Array(21).keys()).map((item, index) =>
                <React.Fragment key={index}>
                    <div className="dash-dote" style={{ left: `${100 / 20 * index}%` }} />
                    <div className="dash-label" style={{ left: `${100 / 20 * index}%` }}>
                        {+index - 10}
                    </div>
                </React.Fragment>
            )
        }
        {
            rates?.map(rate =>
                <RateItem key={rate.subject}
                          rate={rate}
                          onClickRateItem={() => changeSubject(rate.subject)}
                />
            )
        }
    </div>;
}

export default RateLineChart;
