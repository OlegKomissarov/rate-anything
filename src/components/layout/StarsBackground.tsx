import React, { useEffect } from 'react';
import RateStar from './RateStar';
import usePanScreen from '../../utils/usePanScreen';
import useBackgroundData from '../../utils/useBackgroundData';
import useBodyNoScrollBar from '../../utils/useBodyNoScrollBar';
import { trpc } from '../../utils/trpcClient';
import Loader from './Loader';

const StarsBackground: React.FC<{ showStars?: boolean }> = ({ showStars }) => {
    const { backgroundData, generateBackgroundData } = useBackgroundData();
    const { backgroundSize, itemPositions } = backgroundData;

    const { data: averageRateListResponse, isLoading, isFetching } = trpc.rate.getAverageRateList.useQuery(
        {
            limit: 500
        },
        {
            enabled: showStars,
            onSuccess: averageRateListResponse => {
                generateBackgroundData(averageRateListResponse.data.length);
            }
        }
    );

    useEffect(() => {
        // need to wait next tick when background is rendered with the new size
        window.scrollTo({
            top: (backgroundSize.x - window.innerWidth) / 2,
            left: (backgroundSize.y - window.innerHeight) / 2,
            behavior: 'smooth'
        });
    }, [backgroundSize.x, backgroundSize.y]);

    usePanScreen(backgroundSize);

    useBodyNoScrollBar();

    return <div className="stars-background"
                style={{ width: `${backgroundSize.x}px`, height: `${backgroundSize.y}px` }}
    >
        <div className="rate-stars-container">
            {
                averageRateListResponse?.data.length === itemPositions?.length
                && averageRateListResponse.data.map((averageRate, index) =>
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
        {
            showStars && (isLoading || isFetching) &&
            <Loader className="global-loader" />
        }
    </div>;
};

StarsBackground.defaultProps = {
    showStars: true
};

export default StarsBackground;
