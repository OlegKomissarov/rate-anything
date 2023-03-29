import React, { useRef } from 'react';
import RateCard from './RateCard';
import { average_rate } from '@prisma/client';
import { rate } from '@prisma/client';

const RateLineChartItem: React.FC<{
    averageRate: average_rate
    ratesOfSubject: rate[]
    onClickRateItem: () => void
}> = ({ averageRate, ratesOfSubject, onClickRateItem }) => {
    const itemRef = useRef<HTMLDivElement>(null);

    return <div ref={itemRef}
                onClick={onClickRateItem}
                className="line-chart__rate-dote"
                style={{ left: `${100 / 20 * (averageRate.average_rate + 10)}%` }}
    >
        <RateCard averageRate={averageRate} ratesOfSubject={ratesOfSubject} parentRef={itemRef} withTriangle />
    </div>;
};

export default RateLineChartItem;
