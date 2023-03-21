import React, { useEffect } from 'react';
import RateStar from './RateStar';
import usePanScreen from '../../utils/usePanScreen';
import useBackgroundData from '../../utils/useBackgroundData';
import useBodyNoScrollBar from '../../utils/useBodyNoScrollBar';
import { trpc } from '../../utils/trpcClient';

const maxRateSubjectLength = 12;

const StarsBackground: React.FC<{ otherElements: (HTMLElement | null)[] }> = ({ otherElements }) => {
    const { backgroundData, generateBackgroundData } = useBackgroundData();
    const { backgroundSize, itemPositions } = backgroundData;

    const { data: averageRateList } = trpc.rate.getAverageRateList.useQuery({ maxRateSubjectLength },
        { onSuccess: averageRateList => { generateBackgroundData(averageRateList.length); } }
    );

    useEffect(() => {
        // need to wait next tick when background is rendered with the new size
        window.scrollTo({
            top: (backgroundSize.x - window.innerWidth) / 2,
            left: (backgroundSize.y - window.innerHeight) / 2,
            behavior: 'smooth'
        });
    }, [backgroundSize.x, backgroundSize.y]);

    usePanScreen(backgroundSize, otherElements);

    useBodyNoScrollBar();

    return <div className="stars-background"
                style={{ width: `${backgroundSize.x}px`, height: `${backgroundSize.y}px` }}
    >
        <div className="rate-stars-container">
            {
                itemPositions?.length === averageRateList?.length
                && averageRateList.map((averageRate, index) =>
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
