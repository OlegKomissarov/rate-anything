import React, { InputHTMLAttributes, useState } from 'react';
import Input from './Input';
import { getClassName } from '../../utils/utils';
import Loader from '../layout/Loader';

const InputWithSuggestions: React.FC<InputHTMLAttributes<HTMLInputElement> & {
    suggestions?: string[]
    selectSuggestion: (suggestion: string) => void
    selectOnFocus?: boolean
    refValue?: React.Ref<HTMLInputElement>
    isLoading: boolean
}> = ({ suggestions, selectSuggestion, className, value, onChange, isLoading, ...props }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);

    const onClickSuggestion = (suggestion: string) => {
        selectSuggestion(suggestion);
        setShowSuggestions(false);
    };

    return <div className="input-with-suggestions-container form__input">
        {/* Be careful with passing props implicitly here. React may not make the implicit props reactive */}
        <Input {...props}
               value={value}
               onChange={onChange}
               className={getClassName('input-with-suggestions')}
               onFocus={() => setShowSuggestions(true)}
               onBlur={() => setShowSuggestions(false)}
        />
        {
            isLoading &&
            <Loader className="input-with-suggestions__loader" />
        }
        {
            !!(value && suggestions?.length && showSuggestions) &&
            <div className="input-dropdown">
                {
                    suggestions.map(suggestion =>
                        <div key={suggestion}
                             onMouseDown={() => onClickSuggestion(suggestion)}
                             onTouchStart={() => onClickSuggestion(suggestion)}
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
