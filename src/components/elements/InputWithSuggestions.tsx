import React, { InputHTMLAttributes, RefObject, useState } from 'react';
import Input from './Input';
import { getClassName, useDebouncedValue } from '../../utils/utils';
import Loader from '../layout/Loader';
import { ProcedureUseQuery } from '@trpc/react-query/dist/createTRPCReact';

const InputWithSuggestions: React.FC<InputHTMLAttributes<HTMLInputElement> & {
    selectSuggestion: (suggestion: string) => void
    selectOnFocus?: boolean
    refValue?: RefObject<HTMLInputElement>
    value: string
    suggestionListQuery: ProcedureUseQuery<any, any>
    suggestionKeyField: string
}> = ({
    suggestionListQuery, suggestionKeyField, selectSuggestion, className, value, onChange, ...props
}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);

    const debouncedValue = useDebouncedValue<string>(value);

    const { data: suggestionList, isLoading, isFetching } = suggestionListQuery(
        {
            limit: 5,
            searching: { field: suggestionKeyField, value: debouncedValue }
        },
        {
            enabled: !!debouncedValue && showSuggestions,
            keepPreviousData: true
        }
    );

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
            !!(debouncedValue && showSuggestions) && (isLoading || isFetching) &&
            <Loader className="input-with-suggestions__loader" />
        }
        {
            !!(value && suggestionList?.data.length && showSuggestions) &&
            <div className="input-dropdown">
                {
                    suggestionList?.data.map((item: any) => item[suggestionKeyField]).map((suggestion: string) =>
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
