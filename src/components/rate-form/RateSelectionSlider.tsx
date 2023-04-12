import React, { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { getClassName } from '../../utils/utils';

const RateSelectionSlider: React.FC<{
    value: number | string
    changeValue: (value: number) => void
    className?: string
}> = ({ value, changeValue, className }) => {
    const selectionSliderRef = useRef<HTMLDivElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [hoverPositionValue, setHoverPositionValue] = useState<number | null>(null);

    const calculateValueByDragPosition = (clientX: number) => {
        const containerWidth = selectionSliderRef.current?.offsetWidth || 0;
        const containerOffsetLeft = selectionSliderRef.current?.getClientRects()[0].x || 0;
        const position = clientX - containerOffsetLeft;
        const percentagePosition = position / containerWidth * 100;
        let value = Math.round(percentagePosition * 20 / 100 - 10);
        if (value > 10) {
            value = 10;
        }
        if (value < -10) {
            value = -10;
        }
        return value;
    };

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            if (selectionSliderRef.current?.contains(event.target as Node)) {
                setIsDragging(true);
                changeValue(calculateValueByDragPosition(event.clientX));
            }
        };
        const handleMouseMove = (event: MouseEvent) => {
            if (isDragging) {
                changeValue(calculateValueByDragPosition(event.clientX));
            }
        };
        const handleMouseUp = () => {
            if (isDragging) {
                hiddenInputRef.current?.focus();
                setIsDragging(false);
            }
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

    const onKeyDown: KeyboardEventHandler = event => {
        if (event.code === 'ArrowRight' || event.code === 'ArrowUp') {
            if (typeof value === 'number') {
                changeValue(value + 1);
            } else {
                changeValue(1);
            }
        }
        if (event.code === 'ArrowLeft' || event.code === 'ArrowDown') {
            if (typeof value === 'number') {
                changeValue(value - 1);
            } else {
                changeValue(-1);
            }
        }
    };

    return <div ref={selectionSliderRef}
                className={getClassName('selection-slider', className)}
                onMouseMove={event => setHoverPositionValue(calculateValueByDragPosition(event.clientX))}
    >
        <div className="selection-slider__main-line">
            {
                Array.from(Array(21).keys()).map((item, index) =>
                    <div key={index} className="selection-slider__dash-dote" />
                )
            }
        </div>
        {
            typeof hoverPositionValue === 'number' &&
            <div className="selection-slider__number-label-container"
                 style={{ left: `${100 / 20 * (hoverPositionValue + 10)}%` }}
            >
                <div className="selection-slider__number-label">
                    {hoverPositionValue}
                </div>
            </div>
        }
        <input ref={hiddenInputRef}
               value={value}
               readOnly
               className="selection-slider__hidden-input"
               onKeyDown={onKeyDown}
        />
        {
            typeof value === 'number' &&
            <div style={{ left: `${100 / 20 * (value + 10)}%` }}
                 className={
                     getClassName(
                         'selection-slider__selected-value',
                         isDragging && 'selection-slider__selected-value--dragging'
                     )
                 }
            />
        }
    </div>;
};

export default RateSelectionSlider;
