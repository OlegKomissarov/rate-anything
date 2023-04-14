import React from 'react';
import { getClassName } from '../../utils/utils';

const Loader: React.FC<{ className?: string }> = ({ className }) => {
    return <div className={getClassName('loader', className)} />;
};

export default Loader;
