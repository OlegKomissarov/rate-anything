import React, {ButtonHTMLAttributes} from 'react';
import { getClassName } from '../../utils/utils';

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
    className,
    children,
    ...props
}) => {
    return <button className={getClassName('button', className)}
                   {...props}
    >
        {children}
    </button>;
};

export default Button;
