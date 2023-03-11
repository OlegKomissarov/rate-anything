import React, { MouseEventHandler, TouchEventHandler } from 'react';
import { getClassName } from '../../utils';

const Button: React.FC<{
    children: React.ReactNode
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    className?: string
    onTouchMove?: TouchEventHandler<HTMLButtonElement>
    onMouseMove?: MouseEventHandler<HTMLButtonElement>
}> = ({ onClick, className, children, onTouchMove, onMouseMove }) => {
    return <button className={getClassName('button', className)}
                   onClick={onClick}
                   onTouchMove={onTouchMove}
                   onMouseMove={onMouseMove}
    >
        {children}
    </button>;
};

export default Button;
