import React, { useRef } from 'react';
import { getFontSizeByRateValue, getRandomTextColor } from '../../utils/utils';
import { AverageRate } from '@prisma/client';

type RateStarProps = {
    averageRate: AverageRate
    leftPosition: number
    topPosition: number
};

const RateStar = ({ averageRate, leftPosition, topPosition }: RateStarProps) => {
    const color = useRef<string>(getRandomTextColor());
    const fontSize = useRef<number>(getFontSizeByRateValue(averageRate.averageRate));

    return <div className="rate-star"
                style={{
                    left: `${leftPosition}px`,
                    top: `${topPosition}px`
                }}
    >
        <div className="rate-star__text"
             style={{ color: color.current, fontSize: `${fontSize.current}px` }}
        >
            {averageRate.subject}: {averageRate.averageRate}
        </div>
    </div>;
};

export default RateStar;
