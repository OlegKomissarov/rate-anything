import React from 'react';

const Input: React.FC<{
    value: string
    onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void)
    type?: string
    inputMode?: 'search' | 'text' | 'email' | 'tel' | 'url' | 'none' | 'numeric' | 'decimal'
    pattern?: string
    placeholder?: string
    className?: string
    selectOnFocus?: boolean
    refValue?: React.Ref<HTMLInputElement>
}> = ({
    type, inputMode, placeholder, className, pattern, selectOnFocus,
    onChange, value, refValue
}) => {
    return <input type={type}
                  inputMode={inputMode}
                  placeholder={placeholder}
                  className={className ? `input ${className}` : 'input'}
                  pattern={pattern}
                  onFocus={selectOnFocus ? event => event.target.select() : undefined}
                  value={value}
                  onChange={onChange}
                  ref={refValue}
    />;
};

export default Input;
