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
}> = ({ rateInputRef, createRate, subject, changeSubject, rate, changeRate, removeRatesBySubject }) => {
    const { data: session } = useSession();

    const debouncedSubject = useDebouncedValue(subject, 500);
    const { data: averageRateListResponse } = trpc.rate.getAverageRateList.useQuery(
        {
            limit: 5,
            searching: { field: 'subject', value: debouncedSubject }
        },
        {
            enabled: !!debouncedSubject,
            keepPreviousData: true
        }
    );

    return <form className="form"
                 onSubmit={event => {
                     event.preventDefault();
                     createRate();
                 }}
    >
        {
            !!session?.user &&
            <div className="form__user-name-label">{session.user.name}</div>
        }
        <InputWithSuggestions placeholder="Input what you wanna rate"
                              className="form__input"
                              selectOnFocus
                              value={subject}
                              onChange={event => changeSubject(event.target.value)}
                              suggestions={averageRateListResponse?.data.map(averageRate => averageRate.subject)}
                              selectSuggestion={changeSubject}
        />
        <Input placeholder="Input your rate from -10 to 10"
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
        />
        <RateSelectionSlider value={rate}
                             changeValue={changeRate}
                             className="form__selection-slider"
        />
        <Button type="submit" className="form__button">
            RATE
        </Button>
        {
            session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_USER_EMAIL &&
            <Button type="button" onClick={removeRatesBySubject} className="button--secondary">
                REMOVE RATE
            </Button>
        }
    </form>;
};

export default RateForm;
