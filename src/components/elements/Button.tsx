import React from 'react';
import { getClassName } from '../../utils';

const Button: React.FC<{
    children: React.ReactNode
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    className?: string
}> = ({ onClick, className, children }) => {
    return <button className={getClassName('button', className)} onClick={onClick}>
        {children}
    </button>;
};

export default Button;
