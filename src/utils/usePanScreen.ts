import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getLoginStaticElements, Position } from './utils';

const setBodyCursor = (cursor: 'grab' | 'grabbing' | '') => {
    const body = document.getElementsByTagName('body')[0];
    body.style.cursor = cursor;
}

// todo: don't use state here?
export default (backgroundSize: Position, panPos: Position, setPanPos: Dispatch<SetStateAction<Position>>) => {
    const [mousePos, setMousePos] = useState<Position | null>(null);

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            setMousePos({ x: event.clientX, y: event.clientY });
            setBodyCursor('grabbing');
            getLoginStaticElements().forEach((element: HTMLElement) => element.style.pointerEvents = 'none');
        };
        const handleTouchStart = (event: TouchEvent) => {
            setMousePos({ x: event.touches[0].clientX, y: event.touches[0].clientY });
            setBodyCursor('grabbing');
            getLoginStaticElements().forEach((element: HTMLElement) => element.style.pointerEvents = 'none');
        };
        const handleMouseMove = (event: MouseEvent) => {
            panSky({ x: event.clientX, y: event.clientY });
        };
        const handleTouchMove = (event: TouchEvent) => {
            panSky({ x: event.touches[0].clientX, y: event.touches[0].clientY });
        };
        const handleMouseUp = () => {
            setMousePos(null);
            setBodyCursor('grab');
            getLoginStaticElements().forEach((element: HTMLElement) => element.style.pointerEvents = 'auto');
        };
        const handleTouchEnd = () => {
            setMousePos(null);
            setBodyCursor('grab');
            getLoginStaticElements().forEach((element: HTMLElement) => element.style.pointerEvents = 'auto');
        };
        const panSky = (newPos: { x: number, y: number }) => {
            if (!mousePos) {
                return;
            }
            const x = newPos.x;
            const y = newPos.y;
            const deltaX = x - mousePos.x;
            const deltaY = y - mousePos.y;
            const minPosition = { x: 0, y: 0 };
            const maxPosition = { x: backgroundSize.x - window.innerWidth, y: backgroundSize.y - window.innerHeight };
            const newX = panPos.x - deltaX;
            const newY = panPos.y - deltaY;
            const newPosition = { ...panPos };
            if (newX >= minPosition.x && newX <= maxPosition.x) {
                newPosition.x = newX;
            }
            if (newY >= minPosition.y && newY <= maxPosition.y) {
                newPosition.y = newY;
            }
            window.scrollTo(newPosition.x, newPosition.y);
            setPanPos(newPosition);
            setMousePos({ x, y });
        };
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleTouchEnd);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleTouchEnd);
        }
    });

    useEffect(() => {
        setBodyCursor('grab');
        return () => {
            setBodyCursor('');
        }
    }, []);
};
