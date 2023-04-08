import React, { InputHTMLAttributes } from 'react';
import Input from './Input';
import { getClassName } from '../../utils/utils';

const InputWithSuggestions: React.FC<InputHTMLAttributes<HTMLInputElement> & {
    suggestions: string[]
    selectOnFocus?: boolean
    refValue?: React.Ref<HTMLInputElement>
}> = ({ className, value, onChange, suggestions, ...props }) => {
    return <div className="input-with-suggestions-container form__input">
        {/* Be careful with passing props implicitly here. React may not make the implicit props reactive */}
        <Input {...props}
               value={value}
               onChange={onChange}
               className={getClassName('input-with-suggestions')}
        />
        {
            !!value && suggestions.length &&
            <div className="input-dropdown">
                {
                    suggestions.map(suggestion =>
                        <div key={suggestion}
                             className="input-dropdown__suggestion"
                        >
                            {suggestion}
                        </div>
                    )
                }
            </div>
        }
    </div>;
};

export default InputWithSuggestions;
