import React, { MouseEventHandler, TouchEventHandler } from 'react';
import { getClassName } from '../../utils/utils';

// TODO: refactor props. use kind of ...rest?
const Button: React.FC<{
    children: React.ReactNode
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    className?: string
    onTouchMove?: TouchEventHandler<HTMLButtonElement>
    onMouseMove?: MouseEventHandler<HTMLButtonElement>
    onTouchStart?: TouchEventHandler<HTMLButtonElement>
    onMouseDown?: MouseEventHandler<HTMLButtonElement>
    onTouchEnd?: TouchEventHandler<HTMLButtonElement>
    onMouseUp?: MouseEventHandler<HTMLButtonElement>
}> = ({ onClick, className, children, onTouchMove, onMouseMove,
    onTouchStart, onMouseDown, onTouchEnd, onMouseUp
}) => {
    return <button className={getClassName('button', className)}
                   onClick={onClick}
                   onTouchMove={onTouchMove}
                   onMouseMove={onMouseMove}
                   onTouchStart={onTouchStart}
                   onMouseDown={onMouseDown}
                   onTouchEnd={onTouchEnd}
                   onMouseUp={onMouseUp}
    >
        {children}
    </button>;
};

export default Button;
