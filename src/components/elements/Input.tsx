import React, { InputHTMLAttributes } from 'react';
import { getClassName } from '../../utils/utils';

const Input: React.FC<InputHTMLAttributes<HTMLInputElement> & {
    selectOnFocus?: boolean
    refValue?: React.Ref<HTMLInputElement>
}> = ({ className, selectOnFocus, onFocus, refValue, disabled, ...props }) => {
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
