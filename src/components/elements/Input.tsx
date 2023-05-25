import React, { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';
import { getClassName } from '../../utils/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    selectOnFocus?: boolean
};

const Input = forwardRef((
    { className, selectOnFocus, onFocus, disabled, ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
) => {
    return <input {...props}
                  ref={ref}
                  className={getClassName('input', className, disabled && 'disabled')}
                  onFocus={event => {
                      if (selectOnFocus) {
                          event.target.select();
                      }
                      if (onFocus) {
                          onFocus(event);
                      }
                  }}
    />;
});

export default Input;
