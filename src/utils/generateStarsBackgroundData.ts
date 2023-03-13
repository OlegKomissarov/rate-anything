import { getLoginStaticElements, getRandomDecimal, getRandomInteger, Position } from './utils';

const minDistanceBetweenStarsHorizontal = 150;
const minDistanceBetweenStarsVertical = 150;
const minDistanceBetweenStars = Math.hypot(minDistanceBetweenStarsHorizontal, minDistanceBetweenStarsVertical) / 1.5;
const starsPositionsRatio = 2;
const minimalBackgroundSizeScreenRatioX = 1.6;
const minimalBackgroundSizeScreenRatioY = 1.2;

const getRandomPosition = (startPosition: Position) => (
    {
        x: getRandomDecimal(startPosition.x, startPosition.x + minDistanceBetweenStarsHorizontal),
        y: getRandomDecimal(startPosition.y, startPosition.y + minDistanceBetweenStarsVertical)
    }
);

export default (numStars: number) => {
    const starPositions: Position[] = [];
    let positions: Position[] = [getRandomPosition({ x: 0, y: 0 })];
    let backgroundSize = { x: 0, y: 0 };

    if (!numStars || typeof window === 'undefined') {
        return { starPositions, backgroundSize, positions };
    }

    const otherElements = getLoginStaticElements();

    const minBackgroundWidth = window.innerWidth * minimalBackgroundSizeScreenRatioX;
    const minBackgroundHeight = window.innerWidth * minimalBackgroundSizeScreenRatioY;
    let isMinSizeReachedX = false;
    let isMinSizeReachedY = false;
    const addPosition = (position: Position) => {
        positions.push(getRandomPosition(position));
        isMinSizeReachedX = position.x >= minBackgroundWidth;
        isMinSizeReachedY = position.y >= minBackgroundHeight;
    };

    let i = 0;
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

    backgroundSize = {
        x: positionWithMaxX.x + minDistanceBetweenStarsHorizontal,
        y: positionWithMaxY.y + minDistanceBetweenStarsVertical
    };

    const otherElementRects = otherElements.map(element => {
        const rect = element.getBoundingClientRect();
        rect.x = rect.x + backgroundSize.x/2 - window.innerWidth/2;
        rect.y = rect.y + backgroundSize.y/2 - window.innerHeight/2;
        return rect;
    });
    const isCollidingWithOtherElements = (newPosPx: Position) =>
        otherElementRects.some(rect =>
            newPosPx.x > rect.x - minDistanceBetweenStarsHorizontal &&
            newPosPx.x < rect.x + minDistanceBetweenStarsHorizontal + rect.width &&
            newPosPx.y > rect.y - minDistanceBetweenStarsVertical &&
            newPosPx.y < rect.y + minDistanceBetweenStarsVertical + rect.height
        );

    // filter positions to check min distance between all others, n^2
    positions = positions.filter(positionA => {
        return !isCollidingWithOtherElements(positionA) && positions.every(positionB => {
            if (positionA.x === positionB.x && positionA.y === positionB.y) {
                return true;
            }
            const distance = Math.abs(Math.hypot(positionA.x - positionB.x, positionA.y - positionB.y));
            return distance > minDistanceBetweenStars;
        });
    });

    for (let i = 0; i < numStars; i++) {
        const randomPositionIndex = getRandomInteger(0, positions.length - 1);
        const randomPosition = positions[randomPositionIndex];
        starPositions.push({ x: randomPosition.x, y: randomPosition.y });
        positions.splice(randomPositionIndex, 1);
    }

    return { starPositions, backgroundSize };
};
