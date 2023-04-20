import { getRandomDecimal, getRandomInteger, isClient } from '../../utils/utils';
import { useEffect, useRef, useState } from 'react';
import { create as createZustandStore } from 'zustand';

export const starsBackgroundStore = createZustandStore<{
    collapseStarsBackgroundNeighbours: boolean
    setCollapseStarsBackgroundNeighbours: (collapseStarsBackgroundNeighbours: boolean) => void
}>(set => ({
    collapseStarsBackgroundNeighbours: false,
    setCollapseStarsBackgroundNeighbours: (collapseStarsBackgroundNeighbours: boolean) =>
        set({ collapseStarsBackgroundNeighbours })
}));

type Position = {
    x: number;
    y: number;
}

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

// todo: try to optimize it even more.
export const useBackgroundData = () => {
    const [backgroundData, setBackgroundData] = useState<{ backgroundSize: Position, itemPositions: Position[] }>(
        { itemPositions: [], backgroundSize: zeroPosition }
    );

    const generateBackgroundData = (itemsAmount: number) => {
        const itemPositions: Position[] = [];
        let positions: Position[] = [getRandomPosition(zeroPosition)];
        let backgroundSize = zeroPosition;
        if (!itemsAmount || !isClient) {
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


const getPanScreenChildren = () => isClient
    // @ts-ignore
    ? [...document.querySelectorAll('.pan-screen-child')] as (HTMLElement | null)[]
    : [];

const setPanScreenChildrenStyle = (pointerEvents: 'none' | '') => {
    getPanScreenChildren().forEach(element => {
        if (element && element.style) {
            element.style.pointerEvents = pointerEvents;
        }
    });
};

const setBodyStyle = (cursor: 'grab' | 'grabbing' | '', userSelect: 'none' | '') => {
    document.body.style.cursor = cursor;
    document.body.style.userSelect = userSelect;
};

export const usePanScreen = (backgroundSize: Position) => {
    const isPanning = useRef(false);

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            if (!getPanScreenChildren().some(otherElement => otherElement?.contains(event.target as Node))) {
                isPanning.current = true;
                setBodyStyle('grabbing', 'none');
                setPanScreenChildrenStyle('none');
            }
        };
        const handleMouseMove = (event: MouseEvent) => {
            panScreen(event);
        };
        const handleMouseUp = () => {
            isPanning.current = false;
            setBodyStyle('grab', '');
            setPanScreenChildrenStyle('');
        };
        const panScreen = (event: MouseEvent) => {
            if (!isPanning.current) {
                return;
            }
            const minPosition = { x: 0, y: 0 };
            const maxPosition = { x: backgroundSize.x - window.innerWidth, y: backgroundSize.y - window.innerHeight };
            const newPosition = { x: window.scrollX, y: window.scrollY };
            const newX = window.scrollX - event.movementX;
            const newY = window.scrollY - event.movementY;
            if (newX >= minPosition.x && newX <= maxPosition.x) {
                newPosition.x = newX;
            }
            if (newY >= minPosition.y && newY <= maxPosition.y) {
                newPosition.y = newY;
            }
            window.scrollTo(newPosition.x, newPosition.y);
        };
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    });

    useEffect(() => {
        setBodyStyle('grab', '');
        return () => {
            setBodyStyle('', '');
        };
    }, []);
};
