import React, { useEffect, useRef, useState } from 'react';
import { getClassName } from '../../utils';
import { Rate } from "./rateUtils";

const RateItem = (props: { rate: Rate, onClickRateItem: () => void }) => {
    const itemRef = useRef(null);
    const hoverBlockRef = useRef(null);

    const { rate, onClickRateItem } = props;

    const [shouldDropLeftHoverBlock, setShouldDropLeftHoverBlock] = useState(false);

    const dropLeft = () => {
        if (hoverBlockRef.current) {
            const scrollbarWidth = 20;
            const screenWidth = window.innerWidth;
            const itemElement: HTMLElement | null = itemRef.current;
            const hoverBlockElement: HTMLElement | null = hoverBlockRef.current;
            if (!itemElement || !hoverBlockElement) {
                return;
            }
            const itemOffsetLeft = (itemElement as HTMLElement).getBoundingClientRect().x;
            const hoverBlockWidth = (hoverBlockElement as HTMLElement).offsetWidth;
            const shouldDrop = screenWidth - scrollbarWidth <= itemOffsetLeft + hoverBlockWidth;
            if (shouldDropLeftHoverBlock !== shouldDrop) {
                setShouldDropLeftHoverBlock(shouldDrop);
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
