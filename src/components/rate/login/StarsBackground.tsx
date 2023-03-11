import RateStars from './RateStars';
import React, { MouseEventHandler, TouchEventHandler, useEffect, useState } from 'react';
import { Rate } from '../rateUtils';

const StarsBackground: React.FC<{
    averageRates: Rate[]
    rates: Rate[]
    backgroundSize: number
}> = ({ averageRates, rates, backgroundSize }) => {
    const [cursor, setCursor] = useState<'grab' | 'grabbing'>('grab');
    const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

    const getStartPosition = () => {
        const backgroundWidthPx = Math.floor(backgroundSize / 100 * window.innerWidth);
        const backgroundHeightPx = Math.floor(backgroundSize / 100 * window.innerHeight);
        return {
            x: -(backgroundWidthPx / 2 - window.innerWidth / 2),
            y: -(backgroundHeightPx / 2 - window.innerHeight / 2),
        };
    };
    const [containerPos, setContainerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    useEffect(() => {
        const setPosition = () => {
            setContainerPos(getStartPosition());
        };
        if (typeof window !== 'undefined') {
            setPosition();
            window.addEventListener('resize', setPosition);
            return () => {
                window.removeEventListener('resize', setPosition);
            };
        }
    }, []);

    const handleMouseDown: MouseEventHandler<HTMLDivElement> = event => {
        setMousePos({ x: event.clientX, y: event.clientY });
        setCursor('grabbing');
    };
    const handleTouchStart: TouchEventHandler<HTMLDivElement> = event => {
        setMousePos({ x: event.touches[0].clientX, y: event.touches[0].clientY });
        setCursor('grabbing');
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
    };
    const handleTouchEnd = () => {
        setMousePos(null);
        setCursor('grab');
    };
    const panSky = (newPos: { x: number, y: number }) => {
        if (!mousePos) {
            return;
        }
        const x = newPos.x;
        const y = newPos.y;
        const deltaX = x - mousePos.x;
        const deltaY = y - mousePos.y;
        const minPosition = {
            x: getStartPosition().x*2,
            y: getStartPosition().y*2
        };
        const maxPosition = { x: 0, y: 0 };
        const newX = containerPos.x + deltaX;
        const newY = containerPos.y + deltaY;
        if (newX > minPosition.x && newX < maxPosition.x && newY > minPosition.y && newY < maxPosition.y) {
            setContainerPos({ x: newX, y: newY });
        }
        setMousePos({ x, y });
    };

    return <div className="stars-background"
                style={{
                    width: `${backgroundSize}%`,
                    height: `${backgroundSize}%`,
                    transform: `translate(${containerPos.x}px, ${containerPos.y}px)`,
                    cursor: cursor
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleTouchEnd}
    >
        {
            !!averageRates.length &&
            <RateStars rates={rates} averageRates={averageRates} />
        }
        <div className="stars-background__decor-stars" />
        <div className="stars-background__twinkling" />
    </div>;
};

export default StarsBackground;
