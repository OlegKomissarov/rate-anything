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

    const [containerPos, setContainerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    useEffect(() => {
        const calculatePos = () => {
            const backgroundWidthPx = Math.floor((backgroundSize / 100) * window.innerWidth);
            const backgroundHeightPx = Math.floor((backgroundSize / 100) * window.innerHeight);
            setContainerPos({
                x: -(backgroundWidthPx / 2 - window.innerWidth / 2),
                y: -(backgroundHeightPx / 2 - window.innerHeight / 2),
            });
        };
        if (typeof window !== 'undefined') {
            calculatePos();
            window.addEventListener('resize', calculatePos);
            return () => {
                window.removeEventListener('resize', calculatePos);
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
        panSky({ x: event.clientX, y: event.clientY })
    };
    const handleTouchMove: TouchEventHandler<HTMLDivElement> = event => {
        panSky({ x: event.touches[0].clientX, y: event.touches[0].clientY })
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
        setContainerPos({ x: containerPos.x + deltaX, y: containerPos.y + deltaY });
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
