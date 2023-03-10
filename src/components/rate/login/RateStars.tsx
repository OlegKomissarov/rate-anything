import React, { useRef } from 'react';
import { getRatesOfSubject, Rate } from '../rateUtils';
import RateStar from './RateStar';
import { getRandomDecimal } from '../../../utils';

interface Position {
    x: number;
    y: number;
}

interface Size {
    w: number;
    h: number;
}

// Todo: Handle case when there are no more space.
// Todo: Optimize it, when almost no space it will loop too much
const generateStarPositions = (numStars: number) => {
    const positions: Position[] = [];

    const getCentralPosition = (size: number) => 100 / 2 - size / 2;

    const minDistanceBetweenStars = 5;
    const headerSize: Size = { w: 40, h: 16 };
    const headerPos: Position = { x: getCentralPosition(headerSize.w), y: 2 };
    const contentSize: Size = { w: 40, h: 40 };
    const contentPos: Position = { x: getCentralPosition(contentSize.w), y: 100 / 2 - getCentralPosition(contentSize.h) / 2 };

    const isCollidingWithOtherStars = (newPos: Position) =>
        positions.some((pos) => Math.hypot(pos.x - newPos.x, pos.y - newPos.y) < minDistanceBetweenStars);

    const isInsideRestrictedArea = (pos: Position, areaPosition: Position, areaSize: Size) =>
        pos.x > areaPosition.x &&
        pos.x < areaPosition.x + areaSize.w &&
        pos.y > areaPosition.y &&
        pos.y < areaPosition.y + areaSize.h;

    for (let i = 0; i < numStars; i++) {
        let newPos: Position;
        do {
            newPos = { x: getRandomDecimal(10, 90), y: getRandomDecimal(10, 90) };
        } while (
            isCollidingWithOtherStars(newPos)
            || isInsideRestrictedArea(newPos, contentPos, contentSize)
            || isInsideRestrictedArea(newPos, headerPos, headerSize)
        );
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
