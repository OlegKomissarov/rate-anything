const Button = props => {
    const { onClick } = props;

    return <button className="button" onClick={onClick}>
        {props.children}
    </button>;
}

export default Button;
