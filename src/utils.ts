import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const getClassName = (...classNames: Array<string | boolean | undefined>) => {
    let classNamesString = '';
    classNames.forEach(className => {
        if (className && typeof className === 'string') {
            if (classNamesString) {
                classNamesString += ` ${className}`;
            } else {
                classNamesString = className;
            }
        }
    });
    return classNamesString.trim();
};

export const validate = <T>(value: unknown, schema: z.Schema): value is T => {
    try {
        schema.parse(value);
        return true;
    } catch (err) {
        console.log('Validation error occurred for the value: ', value, err instanceof z.ZodError ? fromZodError(err) : err);
        alert(err instanceof z.ZodError ? fromZodError(err) : err);
        return false;
    }
};

export const getRandomDecimal = (min: number, max: number) => Math.random() * (max - min) + min;

export const getRandomInteger = (min: number, max: number) => Math.round(getRandomDecimal(min, max));

export interface Position {
    x: number;
    y: number;
}

const minDistanceBetweenStarsHorizontal = 150; // calc it better
const minDistanceBetweenStarsVertical = 150; // calc it better
const minDistanceBetweenStars = Math.hypot(minDistanceBetweenStarsHorizontal, minDistanceBetweenStarsVertical) / 1.5;
const starsPositionsRatio = 4;
const minimalBackgroundSizeScreenRatioX = 1.6;
const minimalBackgroundSizeScreenRatioY = 1.2;
const getRandomPosition = (startPosition: Position) => (
    {
        x: getRandomDecimal(startPosition.x, startPosition.x + minDistanceBetweenStarsHorizontal),
        y: getRandomDecimal(startPosition.y, startPosition.y + minDistanceBetweenStarsVertical)
    }
);
export const generateStarPositions = (numStars: number) => {
    const starPositions: Position[] = [];
    let positions: Position[] = [getRandomPosition({ x: 0, y: 0 })];

    let i = 0;
    const minBackgroundWidth = window.innerWidth * minimalBackgroundSizeScreenRatioX;
    const minBackgroundHeight = window.innerWidth * minimalBackgroundSizeScreenRatioY;
    let isMinSizeReachedX = false;
    let isMinSizeReachedY = false;
    const addPosition = (position: Position) => {
        positions.push(getRandomPosition(position));
        isMinSizeReachedX = position.x >= minBackgroundWidth;
        isMinSizeReachedY = position.y >= minBackgroundHeight;
    };
    do {
        const amountOfPositionsInNewLine = Math.sqrt(positions.length);
        let j = 0;
        do {
            addPosition({
                x: j === amountOfPositionsInNewLine - 1
                    ? positions[amountOfPositionsInNewLine*amountOfPositionsInNewLine-1].x + minDistanceBetweenStarsHorizontal
                    : positions[(amountOfPositionsInNewLine-1)*(amountOfPositionsInNewLine-1)+j].x + minDistanceBetweenStarsHorizontal,
                y: j ? (positions.at(-1)!.y + minDistanceBetweenStarsVertical) : 0
            });
            j++;
        } while (j < amountOfPositionsInNewLine);
        let k = 0;
        do {
            addPosition({
                x: k ? (positions.at(-1)!.x + minDistanceBetweenStarsHorizontal) : 0,
                y: k === amountOfPositionsInNewLine - 1
                    ? positions[amountOfPositionsInNewLine*amountOfPositionsInNewLine-1].y + minDistanceBetweenStarsVertical
                    : positions[(amountOfPositionsInNewLine-1)*(amountOfPositionsInNewLine-1)+k+amountOfPositionsInNewLine-1].y + minDistanceBetweenStarsVertical,
            });
            k++;
        } while (k < amountOfPositionsInNewLine);
        addPosition({
            x: positions.at(-1)!.x + minDistanceBetweenStarsHorizontal,
            y: positions.at(-1-amountOfPositionsInNewLine)!.y + minDistanceBetweenStarsVertical
        });
        i++;
    } while(positions.length < starsPositionsRatio * numStars || !isMinSizeReachedX || !isMinSizeReachedY);

    const positionWithMaxX = positions.reduce((maxXPosition, currentPosition) => {
        if (currentPosition.x > maxXPosition.x) {
            return currentPosition;
        } else {
            return maxXPosition;
        }
    });
    const positionWithMaxY = positions.reduce((maxYPosition, currentPosition) => {
        if (currentPosition.y > maxYPosition.y) {
            return currentPosition;
        } else {
            return maxYPosition;
        }
    });

    // filter positions to check min distance between all others, n^2
    positions = positions.filter(positionA => {
        return positions.every(positionB => {
            if (positionA.x === positionB.x && positionA.y === positionB.y) {
                return true;
            }
            const distance = Math.abs(Math.hypot(positionA.x - positionB.x, positionA.y - positionB.y));
            return distance > minDistanceBetweenStars;
        });
    });

    const backgroundSize = {
        x: positionWithMaxX.x + minDistanceBetweenStarsHorizontal,
        y: positionWithMaxY.y + minDistanceBetweenStarsVertical
    };

    const a = [...positions];
    for (let i = 0; i < numStars; i++) {
        const randomPositionIndex = getRandomInteger(0, positions.length - 1);
        const randomPosition = positions[randomPositionIndex];
        starPositions.push({ x: randomPosition.x, y: randomPosition.y });
        positions.splice(randomPositionIndex, 1);
    }

    return { starPositions, backgroundSize, positions: a };
};
