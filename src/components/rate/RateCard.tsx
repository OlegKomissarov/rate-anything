import React, { useEffect, useRef, useState } from 'react';
import { Rate } from './rateUtils';
import { getClassName } from '../../utils';

const RateCard: React.FC<{
    averageRate: Rate
    ratesOfSubject: Rate[]
    parentRef: React.RefObject<HTMLDivElement>
}> = ({ averageRate, ratesOfSubject, parentRef }) => {
    const hoverBlockRef = useRef<HTMLDivElement>(null);
    const [shouldDropLeftHoverBlock, setShouldDropLeftHoverBlock] = useState(false);

    const dropLeft = () => {
        if (hoverBlockRef.current) {
            const scrollbarWidth = 20;
            const screenWidth = window.innerWidth;
            const parentElement = parentRef?.current;
            const hoverBlockElement = hoverBlockRef.current;
            if (parentElement && hoverBlockElement) {
                const itemOffsetLeft = parentElement.getBoundingClientRect().x;
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

    return <div ref={hoverBlockRef}
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
    </div>;
};

export default RateCard;
