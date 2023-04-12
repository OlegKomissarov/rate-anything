import React, { useRef, useState } from 'react';
import { getClassName } from '../../utils/utils';

const RateSelectionSlider: React.FC<{
    value: number | string
    changeValue: (value: number) => void
    className?: string
}> = ({ value, changeValue, className }) => {
    const selectionSliderRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState(false);

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

    // todo: use document event and check if there is intersection with selection-slider element, contains...
    return <div ref={selectionSliderRef}
                className={getClassName('selection-slider', className)}
                onMouseDown={event => {
                    setIsDragging(true);
                    changeValue(calculateValueByDragPosition(event.clientX));
                }}
                onMouseMove={event => {
                    if (isDragging) {
                        changeValue(calculateValueByDragPosition(event.clientX));
                    }
                }}
                onMouseUp={() => setIsDragging(false)}
    >
        <div className="selection-slider__main-line">
            {
                Array.from(Array(21).keys()).map(item =>
                    <div key={item} className="selection-slider__dash-dote" />
                )
            }
        </div>
        {
            typeof value === 'number' &&
            <div style={{ left: `${100 / 20 * (value + 10)}%` }}
                 className={
                     getClassName(
                         'selection-slider__selected-value',
                         isDragging && 'selection-slider__selected-value--dragging'
                     )
                 }
            >
                <div className="selection-slider__selected-value-label">
                    {value}
                </div>
            </div>
        }
    </div>;
};

export default RateSelectionSlider;
