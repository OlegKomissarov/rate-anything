import React, {useEffect, useState} from 'react';
import {Position} from '../../../utils/utils';
import RateStar from './RateStar';
import usePanScreen from '../../../utils/usePanScreen';
import useRateList from "../../../utils/useRateList";
import generateBackgroundData from "../../../utils/generateBackgroundData";
import useBodyNoScrollBar from "../../../utils/useBodyNoScrollBar";

const maxRateSubjectLength = 12;

const StarsBackground: React.FC<{ otherElements: HTMLElement[] }> = ({ otherElements }) => {
    const { averageRateList, getRateList } = useRateList(maxRateSubjectLength);
    const [backgroundData, setBackgroundData] = useState<{ backgroundSize: Position, itemPositions: Position[] }>(
        generateBackgroundData(averageRateList.length, otherElements)
    );
    const { backgroundSize, itemPositions } = backgroundData;

    useEffect(() => {
        const loadData = async () => {
            const { averageRateList } = await getRateList();
            setBackgroundData(generateBackgroundData(averageRateList.length, otherElements));
        };
        loadData();
    }, []);

    useEffect(() => {
        // need to wait next tick when background is rendered with the new size
        window.scrollTo((backgroundSize.x - window.innerWidth) / 2, (backgroundSize.y - window.innerHeight) / 2);
    }, [backgroundSize.x, backgroundSize.y]);

    usePanScreen(backgroundSize, otherElements);

    useBodyNoScrollBar();

    return <div className="stars-background"
                style={{width: `${backgroundSize.x}px`, height: `${backgroundSize.y}px`}}
    >
        <div className="rate-stars-container">
            {
                averageRateList.map((averageRate, index) =>
                    <RateStar key={averageRate.subject}
                              averageRate={averageRate}
                              leftPosition={itemPositions[index].x}
                              topPosition={itemPositions[index].y}
                    />
                )
            }
        </div>
        <div className="stars-background__decor-stars" />
        <div className="stars-background__twinkling" />
    </div>;
};

export default StarsBackground;
