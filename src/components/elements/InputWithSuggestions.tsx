import React, { ForwardedRef, forwardRef, InputHTMLAttributes, useRef, useState } from 'react';
import Input from './Input';
import { getClassName, useDebouncedValue, useOnClickOutside } from '../../utils/utils';
import Loader from '../layout/Loader';
import { ProcedureUseQuery } from '@trpc/react-query/dist/createTRPCReact';

type InputWithSuggestionsProps = InputHTMLAttributes<HTMLInputElement> & {
    value: string
    suggestionKeyField: string
    suggestionListQuery: ProcedureUseQuery<any, any>
    suggestionListQueryParams?: {}
    selectSuggestion: (suggestion: string) => void
    selectOnFocus?: boolean
};

const InputWithSuggestions = forwardRef((
    {
        suggestionListQuery, suggestionListQueryParams, suggestionKeyField, selectSuggestion, className, value,
        onChange, ...props
    }: InputWithSuggestionsProps,
    ref: ForwardedRef<HTMLInputElement>
) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [showSuggestions, setShowSuggestions] = useState(false);

    const onClickSuggestion = (suggestion: string) => {
        selectSuggestion(suggestion);
        setShowSuggestions(false);
    };

    const debouncedValue = useDebouncedValue<string>(value);

    const suggestionListQueryEnabled: boolean = !!debouncedValue && showSuggestions;
    const { data: suggestionList, isLoading, isFetching } = suggestionListQuery(
        {
            limit: 5,
            searching: { field: suggestionKeyField, value: debouncedValue },
            ...suggestionListQueryParams
        },
        {
            enabled: suggestionListQueryEnabled,
            keepPreviousData: true
        }
    );

    useOnClickOutside(containerRef.current, () => setShowSuggestions(false));

    return <div ref={containerRef} className="input-with-suggestions-container form__input">
        {/* Be careful with passing props implicitly here. React may not make the implicit props reactive */}
        <Input {...props}
               ref={ref}
               value={value}
               onChange={onChange}
               className={getClassName('input-with-suggestions')}
               onFocus={() => setShowSuggestions(true)}
               onBlur={event => {
                   if (event.relatedTarget) {
                       setShowSuggestions(false);
                   }
               }}
        />
        {
            suggestionListQueryEnabled && (isLoading || isFetching) &&
            <Loader className="input-with-suggestions__loader" />
        }
        {
            !!(value && suggestionList?.data.length && showSuggestions) &&
            <div className="input-dropdown">
                {
                    suggestionList?.data.map((item: any) => item[suggestionKeyField]).map((suggestion: string) =>
                        <div key={suggestion}
                             onClick={() => onClickSuggestion(suggestion)}
                             className="input-dropdown__suggestion"
                        >
                            {suggestion}
                        </div>
                    )
                }
            </div>
        }
    </div>;
});

InputWithSuggestions.defaultProps = {
    suggestionListQueryParams: {}
};

export default InputWithSuggestions;
