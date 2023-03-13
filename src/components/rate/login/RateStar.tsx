import React, {useRef} from 'react';
import {getFontSizeByRate, getRandomTextColor, Rate} from "../../../utils/utils";

const RateStar: React.FC<{
    averageRate: Rate
    leftPosition: number
    topPosition: number
}> = ({ averageRate, leftPosition, topPosition }) => {
    const color = useRef<string>(getRandomTextColor());
    const fontSize = useRef<number>(getFontSizeByRate(averageRate.rate));

    return <div className="rate-star"
                style={{
                    left: `${leftPosition}px`,
                    top: `${topPosition}px`
                }}
    >
        <div className="rate-star__text"
             style={{ color: color.current, fontSize: `${fontSize.current}px` }}
        >
            {averageRate.subject}: {averageRate.rate}
        </div>
    </div>;
};

export default RateStar;
