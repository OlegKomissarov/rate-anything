import React, { MouseEventHandler, TouchEventHandler } from 'react';
import { getClassName } from '../../utils/utils';

// TODO: refactor props. use kind of ...rest?
const Button: React.FC<{
    children: React.ReactNode
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    className?: string
    onMouseDown?: MouseEventHandler<HTMLButtonElement>
}> = ({ onClick, className, children, onMouseDown
}) => {
    return <button className={getClassName('button', className)}
                   onClick={onClick}
                   onMouseDown={onMouseDown}
    >
        {children}
    </button>;
};

export default Button;
