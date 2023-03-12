import React, { useRef } from 'react';
import { Rate } from '../rateUtils';
import { getRandomInteger } from '../../../utils';

const colors = ['#FCFAFB', '#B08B93', '#B5AABA', '#DACFD7', '#785C84', '#D9D2DB', '#C7BECB', '#7F7D7E', '#897891',
    '#B5CFAC', '#A3BB9C', '#C7D1C4', '#8FB782', '#956C71', '#ECE1E3', '#F9F8F9', '#D6CEBB', '#B4BCC5', '#A99E85',
    '#FEFFF9'];

const getRandomTextColor = () => {
    return colors[getRandomInteger(0, colors.length - 1)];
};

const minRate = -10;
const maxRate = 10;
const minFontSize = 7;
const maxFontSize = 20;
const getFontSizeByRate = (rate: number) => {
    // Map the input number from the range [-10, 10] to the range [0, 1]
    const normalizedNum = (rate - minRate) / (maxRate - minRate);

    // Map the normalized number from the range [0, 1] to the range [minRange, maxRange]
    return minFontSize + normalizedNum * (maxFontSize - minFontSize);
};

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
