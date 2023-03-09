import React, { useRef } from 'react';
import { getRatesOfSubject, Rate } from './rateUtils';
import RateStar from './RateStar';

interface Position {
    x: number;
    y: number;
}

// Todo: check and refactor this function. handle case when there are no more space, optimize it
const generateStarPositions = (numStars: number) => {
    const positions: Position[] = [];

    // Generate random position for the first star
    positions.push({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
    });

    // Generate positions for the remaining stars
    for (let i = 1; i < numStars; i++) {
        let newPos: Position;
        let collision: boolean;
        do {
            // Generate a random position
            newPos = {
                x: Math.random() * 80 + 10,
                y: Math.random() * 80 + 10,
            };

            // Check if it collides with any existing position
            collision = positions.some((pos) => {
                const dx = pos.x - newPos.x;
                const dy = pos.y - newPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < 20;
            });
        } while (collision);

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
        <div className="stars"></div>
        <div className="twinkling"></div>
    </div>;
};

export default RateStars;
