const Input = props => {
    const { type, inputMode, placeholder, className, pattern, selectOnFocus, onChange, value, refValue } = props;

    return <input type={type}
                  inputMode={inputMode}
                  placeholder={placeholder}
                  className={className ? `input ${className}` : 'input'}
                  pattern={pattern}
                  onFocus={selectOnFocus ? event => event.target.select() : null}
                  value={value}
                  onChange={onChange}
                  ref={refValue}
    />;
}

export default Input;
