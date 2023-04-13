import React from 'react';
import Input from '../elements/Input';
import Button from '../elements/Button';
import { useSession } from 'next-auth/react';
import InputWithSuggestions from '../elements/InputWithSuggestions';
import { trpc } from '../../utils/trpcClient';
import { useDebouncedValue } from '../../utils/utils';
import RateSelectionSlider from './RateSelectionSlider';

const RateForm: React.FC<{
    rateInputRef: React.RefObject<HTMLInputElement>
    createRate: () => void
    subject: string
    changeSubject: (subject: string) => void
    rate: number | string
    changeRate: (rate: number | string) => void
    removeRatesBySubject: () => void
    isCreateRateLoading: boolean
    isRemoveRateLoading: boolean
}> = ({
    rateInputRef, createRate, subject, changeSubject, rate, changeRate, removeRatesBySubject, isCreateRateLoading,
    isRemoveRateLoading
}) => {
    const { data: session } = useSession();

    const debouncedSubject = useDebouncedValue(subject, 500);
    const {
        data: averageRateListResponse,
        isLoading: isSuggestionListLoading,
        isFetching: isSuggestionListFetching
    } = trpc.rate.getAverageRateList.useQuery(
        {
            limit: 5,
            searching: { field: 'subject', value: debouncedSubject }
        },
        {
            enabled: !!debouncedSubject,
            keepPreviousData: true
        }
    );

    return <form className="form rate-form custom-scrollbar"
                 onSubmit={event => {
                     event.preventDefault();
                     createRate();
                 }}
    >
        {
            !!session?.user &&
            <div className="secondary-text rate-form__user-name-label">{session.user.name}</div>
        }
        <InputWithSuggestions placeholder="What You Wanna Rate"
                              className="form__input"
                              selectOnFocus
                              value={subject}
                              onChange={event => changeSubject(event.target.value)}
                              suggestions={averageRateListResponse?.data.map(averageRate => averageRate.subject)}
                              selectSuggestion={changeSubject}
                              isLoading={debouncedSubject && (isSuggestionListLoading || isSuggestionListFetching)}
                              id="rate-subject-input"
        />
        <Input placeholder="Your Rate from -10 to 10"
               className="form__input"
               selectOnFocus
               value={rate}
               onChange={event => {
                   if (event.target.value === '' || event.target.value === '-') {
                       changeRate(event.target.value);
                   } else if (/^([-]?[1-9]\d*|0)$/.test(event.target.value)) {
                       const numberValue = +event.target.value;
                       if (numberValue >= -10 && numberValue <= 10) {
                           changeRate(numberValue);
                       }
                   }
               }}
               refValue={rateInputRef}
               id="rate-value-input"
        />
        <RateSelectionSlider value={rate}
                             changeValue={changeRate}
                             className="form__selection-slider"
        />
        <Button type="submit"
                className="form__button"
                disabled={!subject || typeof rate !== 'number' || isCreateRateLoading }
        >
            RATE
        </Button>
        {
            session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_USER_EMAIL &&
            <Button type="button"
                    onClick={removeRatesBySubject}
                    className="button--secondary"
                    disabled={!subject || isRemoveRateLoading}
            >
                REMOVE RATE
            </Button>
        }
    </form>;
};

export default RateForm;
