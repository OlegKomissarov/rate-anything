import React, {InputHTMLAttributes} from 'react';

const Input: React.FC<InputHTMLAttributes<HTMLInputElement> & {
    selectOnFocus?: boolean
    refValue?: React.Ref<HTMLInputElement>
}> = ({
    className, selectOnFocus, refValue, ...props
}) => {
    return <input {...props}
                  className={className ? `input ${className}` : 'input'}
                  onFocus={selectOnFocus ? event => event.target.select() : undefined}
                  ref={refValue}
    />;
};

export default Input;
