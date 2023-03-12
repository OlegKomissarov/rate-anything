import React from 'react';
import { getRatesOfSubject, Rate } from '../rateUtils';
import RateStar from './RateStar';
import { Position } from '../../../utils';

const RateStars: React.FC<{
    averageRates: Rate[]
    starPositions: Position[]
}> = ({ averageRates, starPositions }) => {
    return <div className="rate-stars-container">
        {
            averageRates.map((averageRate, index) =>
                <RateStar key={averageRate.subject}
                          averageRate={averageRate}
                          leftPosition={starPositions[index].x}
                          topPosition={starPositions[index].y}
                />
            )
        }
    </div>;
};

export default RateStars;
