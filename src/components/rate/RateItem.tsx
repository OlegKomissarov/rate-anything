import React, { useEffect, useRef, useState } from 'react';
import { getClassName } from '../../utils';
import { Rate } from './rateUtils';

const RateItem: React.FC<{
    rate: Rate
    onClickRateItem: () => void
}> = ({ rate, onClickRateItem }) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const hoverBlockRef = useRef<HTMLDivElement>(null);

    const [shouldDropLeftHoverBlock, setShouldDropLeftHoverBlock] = useState(false);

    const dropLeft = () => {
        if (hoverBlockRef.current) {
            const scrollbarWidth = 20;
            const screenWidth = window.innerWidth;
            const itemElement = itemRef.current;
            const hoverBlockElement = hoverBlockRef.current;
            if (itemElement && hoverBlockElement) {
                const itemOffsetLeft = itemElement.getBoundingClientRect().x;
                const hoverBlockWidth = hoverBlockElement.offsetWidth;
                const shouldDrop = screenWidth - scrollbarWidth <= itemOffsetLeft + hoverBlockWidth;
                if (shouldDropLeftHoverBlock !== shouldDrop) {
                    setShouldDropLeftHoverBlock(shouldDrop);
                }
            }
        }
    }

    useEffect(() => {
        dropLeft();
    }, [rate]);

    return <div ref={itemRef}
                onClick={onClickRateItem}
                className="rate"
                style={{ left: `${100 / 20 * (rate.rate + 10)}%` }}
    >
        <div ref={hoverBlockRef}
             className={getClassName('rate-hover-block', shouldDropLeftHoverBlock && 'rate-hover-block--drop-left')}
        >
            <div className="rate-hover-block__subject"><b>{rate.subject}</b></div>
            <div className="rate-hover-block__rate">Rate: <b>{rate.rate}</b></div>
        </div>
    </div>;
};

export default RateItem;
