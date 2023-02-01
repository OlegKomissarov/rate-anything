import { getClassName } from '../../utils';

const Button = props => {
    const { onClick, className } = props;

    return <button className={getClassName('button', className)} onClick={onClick}>
        {props.children}
    </button>;
}

export default Button;
