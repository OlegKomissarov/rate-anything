import React, { useEffect, useRef, useState } from 'react';
import { Rate } from '../rateUtils';
import { getClassName } from '../../../utils';

const RateCard: React.FC<{
    averageRate: Rate
    ratesOfSubject: Rate[]
    parentRef: React.RefObject<HTMLDivElement>
    withTriangle?: boolean
    darkStyle?: boolean
    showDetails?: boolean,
    color?: string
}> = ({
    averageRate, ratesOfSubject, parentRef, withTriangle, darkStyle,
    showDetails, color
}) => {
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
    };

    useEffect(() => {
        dropLeft();
    }, [averageRate]);

    return <div ref={hoverBlockRef}
                className={getClassName(
                    'rate-hover-block',
                    shouldDropLeftHoverBlock && 'rate-hover-block--drop-left',
                    withTriangle && 'rate-hover-block--with-triangle',
                    darkStyle && 'rate-hover-block--dark-theme'
                )}
                style={{ color, borderColor: color }}
    >
        <div className="rate-hover-block__unbreakable-string">
            <b>
                {
                    showDetails
                        ? `${averageRate.subject}: ${averageRate.rate}`
                        : averageRate.rate
                }
            </b>
        </div>
        {
            showDetails &&
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
        }
    </div>;
};

RateCard.defaultProps = {
    showDetails: true
};

export default RateCard;
