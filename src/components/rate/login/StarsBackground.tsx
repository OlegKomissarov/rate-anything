import React, { Dispatch, SetStateAction } from 'react';
import { Rate } from '../rateUtils';
import { Position } from '../../../utils/utils';
import RateStar from './RateStar';
import usePanScreen from '../../../utils/usePanScreen';

const StarsBackground: React.FC<{
    averageRates: Rate[]
    backgroundSize: Position
    starPositions: Position[]
    panPos: Position
    setPanPos: Dispatch<SetStateAction<Position>>
}> = ({ averageRates, backgroundSize, starPositions, panPos, setPanPos }) => {
    usePanScreen(backgroundSize, panPos, setPanPos);

    return <div className="stars-background"
                style={{width: `${backgroundSize.x}px`, height: `${backgroundSize.y}px`}}
    >
        <div className="rate-stars-container">
            {
                averageRates.map((averageRate, index) =>
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
