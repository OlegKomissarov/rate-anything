import React, { useEffect } from 'react';
import RateStar from './RateStar';
import { trpc } from '../../utils/trpcClient';
import Loader from './Loader';
import { getClassName, useBodyNoScrollBar } from '../../utils/utils';
import { starsBackgroundStore, useBackgroundData, usePanScreen } from './backgroundUtils';

type StarsBackgroundProps = {
    showStars?: boolean
    showCollapseButton?: boolean
};

const StarsBackground = ({ showStars, showCollapseButton }: StarsBackgroundProps) => {
    const collapseStarsBackgroundNeighbours = starsBackgroundStore(state => state.collapseStarsBackgroundNeighbours);
    const setCollapseStarsBackgroundNeighbours = starsBackgroundStore(state => state.setCollapseStarsBackgroundNeighbours);

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

    return <div style={{ width: `${backgroundSize.x}px`, height: `${backgroundSize.y}px` }}
                className={getClassName(
                    'stars-background',
                    showCollapseButton && 'stars-background--with-collapsable-neighbours',
                    collapseStarsBackgroundNeighbours && 'stars-background--collapse-neighbours'
                )}
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
        {
            showCollapseButton &&
            <img src={collapseStarsBackgroundNeighbours ? '/expand-icon.svg' : '/collapse-icon.svg'}
                 alt={collapseStarsBackgroundNeighbours ? 'expand' : 'collapse'}
                 onClick={() => setCollapseStarsBackgroundNeighbours(!collapseStarsBackgroundNeighbours)}
                 className="stars-background__collapse-button"
            />
        }
    </div>;
};

StarsBackground.defaultProps = {
    showStars: true
};

export default React.memo(StarsBackground);
