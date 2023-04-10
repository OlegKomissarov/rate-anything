import React, { FocusEventHandler, InputHTMLAttributes } from 'react';

const Input: React.FC<InputHTMLAttributes<HTMLInputElement> & {
    selectOnFocus?: boolean
    onFocus?: FocusEventHandler
    refValue?: React.Ref<HTMLInputElement>
}> = ({ className, selectOnFocus, onFocus, refValue, ...props }) => {
    return <input {...props}
                  className={className ? `input ${className}` : 'input'}
                  onFocus={event => {
                      if (selectOnFocus) {
                          event.target.select();
                      }
                      if (onFocus) {
                          onFocus(event);
                      }
                  }}
                  ref={refValue}
    />;
};

export default Input;
