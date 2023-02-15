import { getClassName } from '../../utils';
import { MouseEventHandler, ReactNode } from 'react';

const Button = (props: {
    onClick?: (MouseEventHandler<HTMLButtonElement> | undefined)
    className?: string
    children: ReactNode
}) => {
    const { onClick, className } = props;

    return <button className={getClassName('button', className)} onClick={onClick}>
        {props.children}
    </button>;
}

export default Button;
