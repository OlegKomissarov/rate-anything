import React, { ButtonHTMLAttributes } from 'react';
import { getClassName } from '../../utils/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    secondary?: boolean
};

const Button = ({ children, className, disabled, secondary, ...props }: ButtonProps) => {
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
