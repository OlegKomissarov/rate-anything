import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getLoginStaticElements, Position } from './utils';

const setBodyCursor = (cursor: 'grab' | 'grabbing' | '') => {
    const body = document.getElementsByTagName('body')[0];
    body.style.cursor = cursor;
}

// todo: don't use state here?
export default (backgroundSize: Position) => {
    const [mousePos, setMousePos] = useState<Position | null>(null);

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            setMousePos({ x: event.clientX, y: event.clientY });
            setBodyCursor('grabbing');
            getLoginStaticElements().forEach((element: HTMLElement) => element.style.pointerEvents = 'none');
        };
        const handleMouseMove = (event: MouseEvent) => {
            panSky({ x: event.clientX, y: event.clientY });
        };
        const handleMouseUp = () => {
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
            const newPosition = { x: window.scrollX, y: window.scrollY };
            const newX = window.scrollX - deltaX;
            const newY = window.scrollY - deltaY;
            if (newX >= minPosition.x && newX <= maxPosition.x) {
                newPosition.x = newX;
            }
            if (newY >= minPosition.y && newY <= maxPosition.y) {
                newPosition.y = newY;
            }
            window.scrollTo(newPosition.x, newPosition.y);
            setMousePos({ x, y });
        };
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    });

    useEffect(() => {
        setBodyCursor('grab');
        return () => {
            setBodyCursor('');
        }
    }, []);
};
