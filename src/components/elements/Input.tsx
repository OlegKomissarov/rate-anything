import React, {InputHTMLAttributes} from 'react';

const Input: React.FC<InputHTMLAttributes<HTMLInputElement> & {
    selectOnFocus?: boolean
    refValue?: React.Ref<HTMLInputElement>
}> = ({
    type, inputMode, placeholder, className, pattern,
    selectOnFocus, onChange, value, refValue
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
