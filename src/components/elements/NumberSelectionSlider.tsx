import React, { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { getClassName } from '../../utils/utils';
import { validateRateValue } from '../../utils/validations';

const NumberSelectionSlider: React.FC<{
    minValue: number
    maxValue: number
    value: number | string
    changeValue: (value: number) => void
    className?: string
    disabled?: boolean
}> = ({ minValue, maxValue, value, changeValue, className, disabled }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [hoverPositionValue, setHoverPositionValue] = useState<number | null>(null);

    const calculateValueByDragPosition = (clientX: number) => {
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const containerOffsetLeft = containerRef.current?.getClientRects()[0].x || 0;
        const position = clientX - containerOffsetLeft;
        return Math.round(position / containerWidth * (maxValue - minValue) + minValue);
    };

    useEffect(() => {
        const handleSlideStart = (event: MouseEvent | TouchEvent) => {
            if (containerRef.current?.contains(event.target as Node)) {
                setIsDragging(true);
                let clientX;
                if (event instanceof MouseEvent) {
                    clientX = event.clientX;
                } else {
                    clientX = event.touches[0].clientX;
                }
                changeValue(calculateValueByDragPosition(clientX));
            }
        };
        const handleSlideMove = (event: MouseEvent | TouchEvent) => {
            let clientX;
            if (event instanceof MouseEvent) {
                clientX = event.clientX;
            } else {
                clientX = event.touches[0].clientX;
            }
            if (isDragging) {
                changeValue(calculateValueByDragPosition(clientX));
            }
            if (containerRef.current?.contains(event.target as Node)) {
                setHoverPositionValue(calculateValueByDragPosition(clientX));
            }
        };
        const handleSlideEnd = () => {
            if (isDragging) {
                hiddenInputRef.current?.focus();
                setIsDragging(false);
            }
        };
        document.addEventListener('mousedown', handleSlideStart);
        document.addEventListener('touchstart', handleSlideStart);
        document.addEventListener('mousemove', handleSlideMove);
        document.addEventListener('touchmove', handleSlideMove);
        document.addEventListener('mouseup', handleSlideEnd);
        document.addEventListener('touchend', handleSlideEnd);
        return () => {
            document.removeEventListener('mousedown', handleSlideStart);
            document.removeEventListener('touchstart', handleSlideStart);
            document.removeEventListener('mousemove', handleSlideMove);
            document.removeEventListener('touchmove', handleSlideMove);
            document.removeEventListener('mouseup', handleSlideEnd);
            document.removeEventListener('touchend', handleSlideEnd);
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

    const calculatePercentageOffset = (value: number) => 100 / (maxValue - minValue) * (value - minValue);

    return <div ref={containerRef}
                className={getClassName('selection-slider', className, disabled && 'disabled')}
    >
        <div className="selection-slider__main-line">
            {
                Array.from(Array(maxValue - minValue + 1).keys()).map((item, index) =>
                    <div key={index} className="selection-slider__dash-dote" />
                )
            }
        </div>
        {
            validateRateValue(hoverPositionValue) &&
            <div className="selection-slider__number-label-container"
                 style={{ left: `${calculatePercentageOffset(hoverPositionValue)}%` }}
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
            validateRateValue(value) &&
            <div style={{ left: `${calculatePercentageOffset(value)}%` }}
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

export default NumberSelectionSlider;
