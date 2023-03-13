import { useEffect, useRef } from 'react';
import { Position } from './utils';
import {getLoginStaticElements} from "./loginUtils";

const setBodyCursor = (cursor: 'grab' | 'grabbing' | '') => {
    const body = document.getElementsByTagName('body')[0];
    body.style.cursor = cursor;
};

const setOtherElementsPointerEvents = (pointerEvents: 'none' | 'auto') => {
    getLoginStaticElements().forEach((element: HTMLElement) => element.style.pointerEvents = pointerEvents);
};

export default (backgroundSize: Position) => {
    const isPanning = useRef(false);

    useEffect(() => {
        const handleMouseDown = () => {
            isPanning.current = true;
            setBodyCursor('grabbing');
            setOtherElementsPointerEvents('none');
        };
        const handleMouseMove = (event: MouseEvent) => {
            panSky(event);
        };
        const handleMouseUp = () => {
            isPanning.current = false;
            setBodyCursor('grab');
            setOtherElementsPointerEvents('auto');
        };
        const panSky = (event: MouseEvent) => {
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
        }
    });

    useEffect(() => {
        setBodyCursor('grab');
        return () => {
            setBodyCursor('');
        }
    }, []);
};
