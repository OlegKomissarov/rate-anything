import React from 'react';
import { Rate } from '../../../utils/rateUtils';
import useRateStarStyle from "../../../utils/useRateStarStyle";

const RateStar: React.FC<{
    averageRate: Rate
    leftPosition: number
    topPosition: number
}> = ({ averageRate, leftPosition, topPosition }) => {
    const { color, fontSize } = useRateStarStyle(averageRate.rate);

    return <div className="rate-star"
                style={{
                    left: `${leftPosition}px`,
                    top: `${topPosition}px`
                }}
    >
        <div className="rate-star__text"
             style={{ color, fontSize: `${fontSize}px` }}
        >
            {averageRate.subject}: {averageRate.rate}
        </div>
    </div>;
};

export default RateStar;
