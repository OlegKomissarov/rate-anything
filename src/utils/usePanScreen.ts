import { useEffect, useRef } from 'react';
import { isClient, Position } from './utils';

const getOtherElements = () => isClient
    // @ts-ignore
    ? [...document.querySelectorAll('.pan-screen-child')] as (HTMLElement | null)[]
    : [];

const setBodyStyle = (cursor: 'grab' | 'grabbing' | '', userSelect: 'none' | '') => {
    document.body.style.cursor = cursor;
    document.body.style.userSelect = userSelect;
};

const setOtherElementStyles = (pointerEvents: 'none' | '') => {
    getOtherElements().forEach(element => {
        if (element && element.style) {
            element.style.pointerEvents = pointerEvents;
        }
    });
};

const usePanScreen = (backgroundSize: Position) => {
    const isPanning = useRef(false);

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            if (!getOtherElements().some(otherElement => otherElement?.contains(event.target as Node))) {
                isPanning.current = true;
                setBodyStyle('grabbing', 'none');
                setOtherElementStyles('none');
            }
        };
        const handleMouseMove = (event: MouseEvent) => {
            panScreen(event);
        };
        const handleMouseUp = () => {
            isPanning.current = false;
            setBodyStyle('grab', '');
            setOtherElementStyles('');
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

export default usePanScreen;
