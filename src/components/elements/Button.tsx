import React, { ButtonHTMLAttributes } from 'react';
import { getClassName } from '../../utils/utils';

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement> & {
    secondary?: boolean
}> = ({ children, className, disabled, secondary, ...props }) => {
    return <button {...props}
                   className={
                       getClassName(
                           'button',
                           className,
                           disabled && 'disabled',
                           secondary && 'button--secondary'
                       )
                   }
    >
        {children}
    </button>;
};

export default Button;
