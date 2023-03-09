import React, { useRef } from 'react';
import { Rate } from './rateUtils';
import RateCard from './RateCard';

const RateStar: React.FC<{
    averageRate: Rate
    ratesOfSubject: Rate[]
    leftPosition: number
    topPosition: number
}> = ({ averageRate, ratesOfSubject, leftPosition, topPosition }) => {
    const starRef = useRef<HTMLDivElement>(null);

    return <div className="rate-star"
                style={{
                    left: `${leftPosition}%`,
                    top: `${topPosition}%`
                }}
    >
        <div className="rate-star__text">{averageRate.rate}</div>
        <RateCard averageRate={averageRate} ratesOfSubject={ratesOfSubject} parentRef={starRef} />
    </div>;
};

export default RateStar;
