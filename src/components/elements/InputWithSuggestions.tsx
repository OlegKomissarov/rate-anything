import React, { InputHTMLAttributes, useRef, useState } from 'react';
import Input from './Input';
import { getClassName, useOnClickOutside } from '../../utils/utils';

const InputWithSuggestions: React.FC<InputHTMLAttributes<HTMLInputElement> & {
    suggestions?: string[]
    selectSuggestion: (suggestion: string) => void
    selectOnFocus?: boolean
    refValue?: React.Ref<HTMLInputElement>
}> = ({ suggestions, selectSuggestion, className, value, onChange, ...props }) => {
    const containerRef = useRef(null);

    const [showSuggestions, setShowSuggestions] = useState(false);

    useOnClickOutside(containerRef.current, () => setShowSuggestions(false));

    return <div ref={containerRef}
                className="input-with-suggestions-container form__input"
    >
        {/* Be careful with passing props implicitly here. React may not make the implicit props reactive */}
        <Input {...props}
               value={value}
               onChange={onChange}
               className={getClassName('input-with-suggestions')}
               onFocus={() => setShowSuggestions(true)}
        />
        {
            !!(value && suggestions?.length && showSuggestions) &&
            <div className="input-dropdown">
                {
                    suggestions.map(suggestion =>
                        <div key={suggestion}
                             onClick={() => {
                                 selectSuggestion(suggestion);
                                 setShowSuggestions(false);
                             }}
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
