import RateStars from './RateStars';
import React, { MouseEventHandler, TouchEventHandler, useEffect, useState } from 'react';
import { Rate } from '../rateUtils';
import { Position } from '../../../utils';

const StarsBackground: React.FC<{
    averageRates: Rate[]
    rates: Rate[]
    backgroundSize: Position
    starPositions: Position[]
}> = ({ averageRates, rates, backgroundSize, starPositions }) => {
    const [cursor, setCursor] = useState<'grab' | 'grabbing'>('grab');
    const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

    const getStartPosition = () => ({
        x: window.innerWidth / 2 - backgroundSize.x / 2,
        y: window.innerHeight / 2 - backgroundSize.y / 2
    });
    const [containerPos, setContainerPos] = useState<Position>({ x: 0, y: 0 });
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
        const newPosition = { x: containerPos.x, y: containerPos.y };
        const newX = containerPos.x + deltaX;
        const newY = containerPos.y + deltaY;
        if (newX > minPosition.x && newX < maxPosition.x) {
            newPosition.x = newX;
        }
        if (newY > minPosition.y && newY < maxPosition.y) {
            newPosition.y = newY;
        }
        setContainerPos(newPosition);
        setMousePos({ x, y });
    };

    return <div className="stars-background"
                style={{
                    width: `${backgroundSize.x}px`,
                    height: `${backgroundSize.y}px`,
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
        {/*{positions.map((p, index) => <div style={{*/}
        {/*    zIndex: '200',*/}
        {/*    backgroundColor: 'red',*/}
        {/*    width: '5px',*/}
        {/*    height: '5px',*/}
        {/*    borderRadius: '50%',*/}
        {/*    position: 'absolute',*/}
        {/*    color: 'green',*/}
        {/*    left: p.x,*/}
        {/*    top: p.y }} >*/}
        {/*    {index}*/}
        {/*</div>)}*/}
        <RateStars rates={rates} averageRates={averageRates} starPositions={starPositions} />
        <div className="stars-background__decor-stars" />
        <div className="stars-background__twinkling" />
    </div>;
};

export default StarsBackground;
