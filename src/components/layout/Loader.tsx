import React from 'react';
import { getClassName } from '../../utils/utils';

type LoaderProps = {
    className?: string
};

const Loader = ({ className }: LoaderProps) => {
    return <div className={getClassName('loader', className)} />;
};

export default Loader;
