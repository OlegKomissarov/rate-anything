import React, { useRef } from 'react';
import { getRatesOfSubject, Rate } from '../rateUtils';
import RateStar from './RateStar';
import { getRandomDecimal } from '../../../utils';

interface Position {
    x: number;
    y: number;
}

const generateStarPositions = (numStars: number) => {
    const positions: Position[] = [];

    const minDistanceBetweenStars = 5;

    const isCollidingWithOtherStars = (newPos: Position) =>
        positions.some((pos) => Math.hypot(pos.x - newPos.x, pos.y - newPos.y) < minDistanceBetweenStars);

    for (let i = 0; i < numStars; i++) {
        let newPos: Position;
        do {
            newPos = { x: getRandomDecimal(10, 90), y: getRandomDecimal(10, 90) };
        } while (isCollidingWithOtherStars(newPos));
        positions.push(newPos);
    }

    return positions;
};

const RateStars: React.FC<{
    averageRates: Rate[]
    rates: Rate[]
}> = ({ averageRates, rates }) => {
    const starPositions = useRef(generateStarPositions(averageRates.length));

    return <div className="rate-stars-container">
        {
            averageRates.map((averageRate, index) =>
                <RateStar averageRate={averageRate}
                          leftPosition={starPositions.current[index].x}
                          topPosition={starPositions.current[index].y}
                          ratesOfSubject={getRatesOfSubject(rates, averageRate.subject)}
                />
            )
        }
    </div>;
};

export default RateStars;
