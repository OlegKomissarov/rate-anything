import React, { useEffect } from 'react';
import RateStar from './RateStar';
import { trpc } from '../../utils/trpcClient';
import Loader from './Loader';
import { useBodyNoScrollBar } from '../../utils/utils';
import { useBackgroundData, usePanScreen } from './backgroundUtils';

type StarsBackgroundProps = {
    showStars?: boolean
};

const StarsBackground = ({ showStars }: StarsBackgroundProps) => {
    const { backgroundData, generateBackgroundData } = useBackgroundData();
    const { backgroundSize, itemPositions } = backgroundData;

    useEffect(() => {
        // need to wait next tick when background is rendered with the new size
        window.scrollTo({
            top: (backgroundSize.x - window.innerWidth) / 2,
            left: (backgroundSize.y - window.innerHeight) / 2,
            behavior: 'smooth'
        });
    }, [backgroundSize.x, backgroundSize.y]);

    useBodyNoScrollBar();

    usePanScreen(backgroundSize);

    const averageRateListQueryEnabled: boolean = !!showStars;
    const { data: averageRateListResponse, isLoading, isFetching } = trpc.rate.getAverageRateList.useQuery(
        {
            limit: 500
        },
        {
            enabled: averageRateListQueryEnabled,
            onSuccess: averageRateListResponse => {
                generateBackgroundData(averageRateListResponse.data.length);
            }
        }
    );

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
            averageRateListQueryEnabled && (isLoading || isFetching) &&
            <Loader className="global-loader" />
        }
    </div>;
};

StarsBackground.defaultProps = {
    showStars: true
};

export default StarsBackground;
