import React, { useRef } from 'react';
import RateCard from './RateCard';
import { AverageRate } from '../../utils/utils';
import { rate } from '@prisma/client';

const RateLineChartItem: React.FC<{
    averageRate: AverageRate
    ratesOfSubject: rate[]
    onClickRateItem: () => void
}> = ({ averageRate, ratesOfSubject, onClickRateItem }) => {
    const itemRef = useRef<HTMLDivElement>(null);

    return <div ref={itemRef}
                onClick={onClickRateItem}
                className="line-chart__rate-dote"
                style={{ left: `${100 / 20 * (averageRate.rate + 10)}%` }}
    >
        <RateCard averageRate={averageRate} ratesOfSubject={ratesOfSubject} parentRef={itemRef} withTriangle />
    </div>;
};

export default RateLineChartItem;
