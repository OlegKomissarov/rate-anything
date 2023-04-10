import React from 'react';

const RateSelectionSlider: React.FC<{
    value: number | string
    changeValue: (value: number) => void
}> = ({ value, changeValue }) => {
    return <div className="selection-slider">
        <div className="selection-slider__main-line" />
        {
            Array.from(Array(21).keys()).map((item, index) =>
                <React.Fragment key={index}>
                    <div className="selection-slider__dash-dote"
                         style={{ left: `${100 / 20 * index}%` }}
                         onClick={() => changeValue(index - 10)}
                    />
                    <div className="selection-slider__dash-label"
                         style={{ left: `${100 / 20 * index}%` }}
                         onClick={() => changeValue(index - 10)}
                    >
                        {+index - 10}
                    </div>
                </React.Fragment>
            )
        }
        {
            typeof value === 'number' &&
            <div className="selection-slider__selected-value"
                 style={{ left: `${100 / 20 * (value + 10)}%` }}
            />
        }
    </div>;
};

export default RateSelectionSlider;
