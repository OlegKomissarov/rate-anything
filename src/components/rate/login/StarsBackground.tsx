import React from 'react';
import { Rate } from '../../../utils/rateUtils';
import { Position } from '../../../utils/utils';
import RateStar from './RateStar';
import usePanScreen from '../../../utils/usePanScreen';

const StarsBackground: React.FC<{
    averageRateList: Rate[]
    backgroundSize: Position
    starPositions: Position[]
}> = ({ averageRateList, backgroundSize, starPositions }) => {
    usePanScreen(backgroundSize);

    return <div className="stars-background"
                style={{width: `${backgroundSize.x}px`, height: `${backgroundSize.y}px`}}
    >
        <div className="rate-stars-container">
            {
                averageRateList.map((averageRate, index) =>
                    <RateStar key={averageRate.subject}
                              averageRate={averageRate}
                              leftPosition={starPositions[index].x}
                              topPosition={starPositions[index].y}
                    />
                )
            }
        </div>
        <div className="stars-background__decor-stars" />
        <div className="stars-background__twinkling" />
    </div>;
};

export default StarsBackground;
