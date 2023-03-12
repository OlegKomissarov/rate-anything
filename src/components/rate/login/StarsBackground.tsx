import React, { Dispatch, MouseEventHandler, SetStateAction, TouchEventHandler, useEffect, useState } from 'react';
import { Rate } from '../rateUtils';
import { getLoginStaticElements, Position } from '../../../utils';
import RateStar from "./RateStar";

const StarsBackground: React.FC<{
    averageRates: Rate[]
    backgroundSize: Position
    starPositions: Position[]
    panPos: Position
    setPanPos: Dispatch<SetStateAction<Position>>
}> = ({ averageRates, backgroundSize, starPositions, panPos, setPanPos }) => {
    const [cursor, setCursor] = useState<'grab' | 'grabbing'>('grab');
    const [mousePos, setMousePos] = useState<Position | null>(null);

    const handleMouseDown: MouseEventHandler<HTMLDivElement> = event => {
        setMousePos({ x: event.clientX, y: event.clientY });
        setCursor('grabbing');
        getLoginStaticElements().forEach((element: HTMLElement) => element.style.pointerEvents = 'none');
    };
    const handleTouchStart: TouchEventHandler<HTMLDivElement> = event => {
        setMousePos({ x: event.touches[0].clientX, y: event.touches[0].clientY });
        setCursor('grabbing');
        getLoginStaticElements().forEach((element: HTMLElement) => element.style.pointerEvents = 'none');
    };
    const handleMouseMove: MouseEventHandler<HTMLDivElement> = event => {
        panSky({ x: event.clientX, y: event.clientY });
    };
    const handleTouchMove: TouchEventHandler<HTMLDivElement> = event => {
        panSky({ x: event.touches[0].clientX, y: event.touches[0].clientY });
    };
    const handleMouseUp = () => {
        setMousePos(null);
        setCursor('grab');
        getLoginStaticElements().forEach((element: HTMLElement) => element.style.pointerEvents = 'auto');
    };
    const handleTouchEnd = () => {
        setMousePos(null);
        setCursor('grab');
        getLoginStaticElements().forEach((element: HTMLElement) => element.style.pointerEvents = 'auto');
    };
    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleTouchEnd);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleTouchEnd);
        }
    }, []);
    const panSky = (newPos: { x: number, y: number }) => {
        if (!mousePos) {
            return;
        }
        const x = newPos.x;
        const y = newPos.y;
        const deltaX = x - mousePos.x;
        const deltaY = y - mousePos.y;
        const minPosition = {
            x: window.innerWidth - backgroundSize.x,
            y: window.innerHeight - backgroundSize.y
        };
        const maxPosition = { x: 0, y: 0 };
        const newPosition = { x: panPos.x, y: panPos.y };
        const newX = panPos.x + deltaX;
        const newY = panPos.y + deltaY;
        if (newX > minPosition.x && newX < maxPosition.x) {
            newPosition.x = newX;
        }
        if (newY > minPosition.y && newY < maxPosition.y) {
            newPosition.y = newY;
        }
        setPanPos(newPosition);
        setMousePos({ x, y });
    };

    return <div className="stars-background"
                style={{
                    width: `${backgroundSize.x}px`,
                    height: `${backgroundSize.y}px`,
                    transform: `translate(${panPos.x}px, ${panPos.y}px)`,
                    cursor: cursor
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
    >
        <div className="rate-stars-container">
            {
                averageRates.map((averageRate, index) =>
                    <RateStar key={averageRate.subject}
                              averageRate={averageRate}
                              leftPosition={starPositions[index].x}
                              topPosition={starPositions[index].y}
                    />
                )
            }
        </div>
        <div className="stars-background__decor-stars" />
        <div className="stars-background__twinkling" />
    </div>;
};

export default StarsBackground;
