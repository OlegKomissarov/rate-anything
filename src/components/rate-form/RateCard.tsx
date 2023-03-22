import React, { useEffect, useRef, useState } from 'react';
import { AverageRate, getClassName, Rate } from '../../utils/utils';

const RateCard: React.FC<{
    averageRate: AverageRate
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
    const rateCardRef = useRef<HTMLDivElement>(null);
    const [shouldDropLeft, setShouldDropLeft] = useState(false);

    const dropLeft = () => {
        if (rateCardRef.current) {
            const scrollbarWidth = 20;
            const screenWidth = window.innerWidth;
            const parentElement = parentRef?.current;
            const rateCardElement = rateCardRef.current;
            if (parentElement && rateCardElement) {
                const itemOffsetLeft = parentElement.getBoundingClientRect().x;
                const rateCardWidth = rateCardElement.offsetWidth;
                const shouldDrop = screenWidth - scrollbarWidth <= itemOffsetLeft + rateCardWidth;
                if (shouldDropLeft !== shouldDrop) {
                    setShouldDropLeft(shouldDrop);
                }
            }
        }
    };

    useEffect(() => {
        dropLeft();
    }, [averageRate]);

    return <div ref={rateCardRef}
                className={getClassName(
                    'rate-card',
                    shouldDropLeft && 'rate-card--drop-left',
                    withTriangle && 'rate-card--with-triangle',
                    darkStyle && 'rate-card--dark-theme'
                )}
                style={{ color, borderColor: color }}
    >
        <div className="rate-card__unbreakable-string">
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
                        <div key={rate.useremail}
                             className="rate-card__unbreakable-string"
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
