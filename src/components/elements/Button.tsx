import React, { ButtonHTMLAttributes } from 'react';
import { getClassName } from '../../utils/utils';

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
    className, children, ...props
}) => {
    return <button {...props}
                   className={getClassName('button', className)}
    >
        {children}
    </button>;
};

export default Button;
