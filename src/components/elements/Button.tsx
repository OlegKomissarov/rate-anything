import React, { ButtonHTMLAttributes } from 'react';
import { getClassName } from '../../utils/utils';

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
    className, children, disabled, ...props
}) => {
    return <button {...props}
                   className={getClassName('button', className, disabled && 'button--disabled')}
    >
        {children}
    </button>;
};

export default Button;
