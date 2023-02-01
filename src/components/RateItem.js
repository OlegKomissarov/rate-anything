import React, { useEffect, useRef, useState } from 'react';
import { getClassName } from '../utils';

const RateItem = props => {
    const itemRef = useRef();
    const hoverBlockRef = useRef();

    const { rate, onClickRateItem } = props;

    const [shouldDropLeftHoverBlock, setShouldDropLeftHoverBlock] = useState(false);

    const dropLeft = () => {
        if (hoverBlockRef.current) {
            const scrollbarWidth = 20;
            const screenWidth = window.innerWidth;
            const itemOffsetLeft = itemRef.current.getBoundingClientRect().x;
            const hoverBlockWidth = hoverBlockRef.current.offsetWidth;
            console.log(screenWidth , scrollbarWidth , itemOffsetLeft , hoverBlockWidth)
            const shouldDrop = screenWidth - scrollbarWidth <= itemOffsetLeft + hoverBlockWidth;
            if (shouldDropLeftHoverBlock !== shouldDrop) {
                setShouldDropLeftHoverBlock(shouldDrop);
            }
        }
    }

    useEffect(() => {
        dropLeft();
    }, [rate]);
    // dropLeft();

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
}

export default RateItem;
