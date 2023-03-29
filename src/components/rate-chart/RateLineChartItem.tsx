import React, { useRef } from 'react';
import RateCard from './RateCard';
import { AverageRate, Rate } from '@prisma/client';

const RateLineChartItem: React.FC<{
    averageRate: AverageRate & { rates: Rate[] }
    onClickRateItem: () => void
}> = ({ averageRate, onClickRateItem }) => {
    const itemRef = useRef<HTMLDivElement>(null);

    return <div ref={itemRef}
                onClick={onClickRateItem}
                className="line-chart__rate-dote"
                style={{ left: `${100 / 20 * (averageRate.averageRate + 10)}%` }}
    >
        <RateCard averageRate={averageRate} parentRef={itemRef} withTriangle />
    </div>;
};

export default RateLineChartItem;
