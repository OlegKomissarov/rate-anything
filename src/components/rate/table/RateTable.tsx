import React from 'react';
import { getRatesOfSubject, Rate } from '../rateUtils';

const RateTable: React.FC<{
    rates: Rate[]
    averageRates: Rate[]
}> = ({ rates, averageRates }) => {
    return <div className="rate-table">
        {
            averageRates.map(averageRate =>
                <div className="rate-table__row">
                    <div className="rate-table__item rate-table__item--name">
                        {averageRate.subject}
                    </div>
                    <div className="rate-table__item rate-table__item--rate">
                        {averageRate.rate}
                    </div>
                    <div className="rate-table__item rate-table__item--users">
                        {getRatesOfSubject(rates, averageRate.subject).map(rate => <div>{rate.username}</div>)}
                    </div>
                </div>
            )
        }
    </div>;
};

export default RateTable;
