import React, { InputHTMLAttributes, RefObject } from 'react';
import { getClassName } from '../../utils/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    selectOnFocus?: boolean
    refValue?: RefObject<HTMLInputElement>
};

const Input = ({ className, selectOnFocus, onFocus, refValue, disabled, ...props }: InputProps) => {
    return <input {...props}
                  className={getClassName('input', className, disabled && 'disabled')}
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
