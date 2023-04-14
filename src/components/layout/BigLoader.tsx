import React from 'react';
import { getClassName, isMobile } from '../../utils/utils';
import Loader from './Loader';

const BigLoader: React.FC<{ className?: string }> = ({ className }) => {
    if (isMobile()) {
        return <Loader />;
    }

    return <div className={getClassName('big-loader', className)}>
        <div className="big-loader__planet">
            <div className="big-loader__ring" />
            <div className="big-loader__cover-ring" />
            <div className="big-loader__spots">
                <div className="big-loader__spot" />
                <div className="big-loader__spot" />
                <div className="big-loader__spot" />
                <div className="big-loader__spot" />
                <div className="big-loader__spot" />
                <div className="big-loader__spot" />
                <div className="big-loader__spot" />
            </div>
        </div>
        <div className="big-loader__text secondary-text">loading</div>
    </div>;
};

export default BigLoader;
