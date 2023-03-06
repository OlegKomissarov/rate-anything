import React, { useEffect, useRef, useState } from 'react';
import { getClassName } from '../../utils';
import { Rate } from './rateUtils';

const RateItem: React.FC<{
    averageRate: Rate
    ratesOfSubject: Rate[]
    onClickRateItem: () => void
}> = ({ averageRate, ratesOfSubject, onClickRateItem }) => {
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
    }, [averageRate]);

    return <div ref={itemRef}
                onClick={onClickRateItem}
                className="rate"
                style={{ left: `${100 / 20 * (averageRate.rate + 10)}%` }}
    >
        <div ref={hoverBlockRef}
             className={getClassName('rate-hover-block', shouldDropLeftHoverBlock && 'rate-hover-block--drop-left')}
        >
            <div className="rate-hover-block__unbreakable-string">
                <b>
                    {averageRate.subject}: {averageRate.rate}
                </b>
            </div>
            <div>
                {
                    ratesOfSubject.map(rate =>
                        <div key={rate.username}
                             className="rate-hover-block__unbreakable-string"
                        >
                            {rate.username}
                        </div>
                    )
                }
            </div>
        </div>
    </div>;
};

export default RateItem;
