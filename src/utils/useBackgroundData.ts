import { getRandomDecimal, getRandomInteger, Position } from './utils';
import { useState } from 'react';

const minDistanceBetweenItemsHorizontal = 150;
const minDistanceBetweenItemsVertical = 150;
const minDistanceBetweenItems = Math.hypot(minDistanceBetweenItemsHorizontal, minDistanceBetweenItemsVertical) / 1.5;
const itemPositionsRatio = 2;
const minBackgroundSizeScreenRatioX = 1.6;
const minBackgroundSizeScreenRatioY = 1.2;

const zeroPosition = { x: 0, y: 0 };
const getRandomPosition = (itemPosition: Position) => (
    {
        x: getRandomDecimal(itemPosition.x, itemPosition.x + minDistanceBetweenItemsHorizontal),
        y: getRandomDecimal(itemPosition.y, itemPosition.y + minDistanceBetweenItemsVertical)
    }
);

export default () => {
    const [backgroundData, setBackgroundData] = useState<{ backgroundSize: Position, itemPositions: Position[] }>(
        { itemPositions: [], backgroundSize: zeroPosition }
    );

    const generateBackgroundData = (itemsAmount: number) => {
        const itemPositions: Position[] = [];
        let positions: Position[] = [getRandomPosition(zeroPosition)];
        let backgroundSize = zeroPosition;
        if (!itemsAmount || typeof window === 'undefined') {
            return { itemPositions, backgroundSize };
        }

        const minBackgroundWidth = window.innerWidth * minBackgroundSizeScreenRatioX;
        const minBackgroundHeight = window.innerWidth * minBackgroundSizeScreenRatioY;
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
                        ? positions[amountOfPositionsInNewLine * amountOfPositionsInNewLine - 1].x + minDistanceBetweenItemsHorizontal
                        : positions[(amountOfPositionsInNewLine - 1) * (amountOfPositionsInNewLine - 1) + j].x + minDistanceBetweenItemsHorizontal,
                    y: j ? (positions.at(-1)!.y + minDistanceBetweenItemsVertical) : 0
                });
                j++;
            } while (j < amountOfPositionsInNewLine);
            let k = 0;
            do {
                addPosition({
                    x: k ? (positions.at(-1)!.x + minDistanceBetweenItemsHorizontal) : 0,
                    y: k === amountOfPositionsInNewLine - 1
                        ? positions[amountOfPositionsInNewLine * amountOfPositionsInNewLine - 1].y + minDistanceBetweenItemsVertical
                        : positions[(amountOfPositionsInNewLine - 1) * (amountOfPositionsInNewLine - 1) + k + amountOfPositionsInNewLine - 1].y + minDistanceBetweenItemsVertical
                });
                k++;
            } while (k < amountOfPositionsInNewLine);
            addPosition({
                x: positions.at(-1)!.x + minDistanceBetweenItemsHorizontal,
                y: positions.at(-1 - amountOfPositionsInNewLine)!.y + minDistanceBetweenItemsVertical
            });
            i++;
        } while (positions.length < itemPositionsRatio * itemsAmount || !isMinSizeReachedX || !isMinSizeReachedY);

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
            x: positionWithMaxX.x + minDistanceBetweenItemsHorizontal,
            y: positionWithMaxY.y + minDistanceBetweenItemsVertical
        };

        // filter positions to check min distance between all others, n^2
        positions = positions.filter(positionA => {
            return positions.every(positionB => {
                if (positionA.x === positionB.x && positionA.y === positionB.y) {
                    return true;
                }
                const distance = Math.abs(Math.hypot(positionA.x - positionB.x, positionA.y - positionB.y));
                return distance > minDistanceBetweenItems;
            });
        });

        for (let i = 0; i < itemsAmount; i++) {
            const randomPositionIndex = getRandomInteger(0, positions.length - 1);
            const randomPosition = positions[randomPositionIndex];
            itemPositions.push({ x: randomPosition.x, y: randomPosition.y });
            positions.splice(randomPositionIndex, 1);
        }

        setBackgroundData({ itemPositions, backgroundSize });
    };

    return { backgroundData, generateBackgroundData };
};
