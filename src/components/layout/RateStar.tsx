import React, { useRef } from 'react';
import { getFontSizeByNumber, getRandomTextColor } from '../../utils/utils';
import { AverageRate } from '@prisma/client';

const RateStar: React.FC<{
    averageRate: AverageRate
    leftPosition: number
    topPosition: number
}> = ({ averageRate, leftPosition, topPosition }) => {
    const color = useRef<string>(getRandomTextColor());
    const fontSize = useRef<number>(getFontSizeByNumber(averageRate.averageRate));

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
