import React, { useRef } from 'react';
import { Rate } from '../rateUtils';
import RateCard from './RateCard';
import { getRandomInteger } from '../../../utils';

const colors = ['#FCFAFB', '#B08B93', '#B5AABA', '#DACFD7', '#785C84', '#D9D2DB', '#C7BECB', '#7F7D7E', '#897891',
    '#B5CFAC', '#A3BB9C', '#C7D1C4', '#8FB782', '#956C71', '#ECE1E3', '#F9F8F9', '#D6CEBB', '#B4BCC5', '#A99E85',
    '#FEFFF9'];

const getRandomTextColor = () => {
    return colors[getRandomInteger(0, colors.length - 1)];
};

const RateStar: React.FC<{
    averageRate: Rate
    ratesOfSubject: Rate[]
    leftPosition: number
    topPosition: number
}> = ({ averageRate, ratesOfSubject, leftPosition, topPosition }) => {
    const starRef = useRef<HTMLDivElement>(null);
    const color = useRef<string>(getRandomTextColor());

    return <div className="rate-star"
                style={{
                    left: `${leftPosition}px`,
                    top: `${topPosition}px`
                }}
    >
        <div className="rate-star__text"
             style={{ color: color?.current }}
        >
            {averageRate.subject}
        </div>
        <RateCard averageRate={averageRate}
                  ratesOfSubject={ratesOfSubject}
                  parentRef={starRef}
                  darkStyle
                  showDetails={false}
                  color={color?.current}
        />
    </div>;
};

export default RateStar;
