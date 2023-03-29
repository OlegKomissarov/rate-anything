import React, { useRef } from 'react';
import { getFontSizeByNumber, getRandomTextColor } from '../../utils/utils';
import { average_rate } from '@prisma/client';

const RateStar: React.FC<{
    averageRate: average_rate
    leftPosition: number
    topPosition: number
}> = ({ averageRate, leftPosition, topPosition }) => {
    const color = useRef<string>(getRandomTextColor());
    const fontSize = useRef<number>(getFontSizeByNumber(averageRate.average_rate));

    return <div className="rate-star"
                style={{
                    left: `${leftPosition}px`,
                    top: `${topPosition}px`
                }}
    >
        <div className="rate-star__text"
             style={{ color: color.current, fontSize: `${fontSize.current}px` }}
        >
            {averageRate.subject}: {averageRate.average_rate}
        </div>
    </div>;
};

export default RateStar;
