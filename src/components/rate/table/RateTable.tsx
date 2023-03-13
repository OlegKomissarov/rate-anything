import React from 'react';
import {getRatesOfSubject, Rate} from "../../../utils/utils";

const RateTable: React.FC<{
    rateList: Rate[]
    averageRateList: Rate[]
}> = ({ rateList, averageRateList }) => {
    return <div className="rate-table">
        {
            averageRateList.map(averageRate =>
                <div className="rate-table__row" key={averageRate.subject}>
                    <div className="rate-table__item rate-table__item--name">
                        {averageRate.subject}
                    </div>
                    <div className="rate-table__item rate-table__item--rate">
                        {averageRate.rate}
                    </div>
                    <div className="rate-table__item rate-table__item--users">
                        {getRatesOfSubject(rateList, averageRate.subject).map(rate =>
                            <div key={rate.username}>{rate.username}</div>
                        )}
                    </div>
                </div>
            )
        }
    </div>;
};

export default RateTable;
