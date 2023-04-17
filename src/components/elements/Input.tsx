import React, { InputHTMLAttributes, RefObject } from 'react';
import { getClassName } from '../../utils/utils';

const Input: React.FC<InputHTMLAttributes<HTMLInputElement> & {
    selectOnFocus?: boolean
    refValue?: RefObject<HTMLInputElement>
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
