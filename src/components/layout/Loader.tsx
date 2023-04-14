import React from 'react';
import { getClassName, useLoaderDelay } from '../../utils/utils';

const Loader: React.FC<{ className?: string }> = ({ className }) => {
    const showLoader = useLoaderDelay();

    if (!showLoader) {
        return null;
    }

    return <div className={getClassName('loader', className)} />;
};

export default Loader;
