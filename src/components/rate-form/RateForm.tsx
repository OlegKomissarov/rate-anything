import React from 'react';
import Input from '../elements/Input';
import Button from '../elements/Button';
import { useSession } from 'next-auth/react';
import InputWithSuggestions from '../elements/InputWithSuggestions';
import { trpc } from '../../utils/trpcClient';
import { isMobile, useDisableBodyScroll } from '../../utils/utils';
import Loader from '../layout/Loader';
import NumberSelectionSlider from '../elements/NumberSelectionSlider';

const RateForm: React.FC<{
    createRate: () => void
    subject: string
    changeSubject: (subject: string) => void
    rate: number | string
    changeRate: (rate: number | string) => void
    removeRatesBySubject: () => void
    isCreateRateLoading: boolean
    isRemoveRateLoading: boolean
}> = ({
    createRate, subject, changeSubject, rate, changeRate, removeRatesBySubject, isCreateRateLoading, isRemoveRateLoading
}) => {
    const scrollableElementRef = useDisableBodyScroll();

    const { data: session } = useSession();

    return <form ref={scrollableElementRef}
                 className="form rate-form custom-scrollbar"
                 onSubmit={event => {
                     event.preventDefault();
                     createRate();
                 }}
    >
        {
            !!session?.user && !isMobile() &&
            <div className="secondary-text rate-form__user-name-label">{session.user.name}</div>
        }
        <InputWithSuggestions placeholder="What You Wanna Rate"
                              className="form__input"
                              selectOnFocus
                              value={subject}
                              onChange={event => changeSubject(event.target.value)}
                              selectSuggestion={changeSubject}
                              id="rate-subject-input"
                              suggestionListQuery={trpc.rate.getAverageRateList.useQuery}
                              suggestionKeyField="subject"
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
               id="rate-value-input"
               disabled={!subject}
        />
        <NumberSelectionSlider minValue={-10}
                               maxValue={10}
                               value={rate}
                               changeValue={changeRate}
                               className="form__selection-slider"
                               disabled={!subject}
        />
        <Button type="submit"
                className="form__button form__submit-button"
                disabled={!subject || typeof rate !== 'number' || isCreateRateLoading }
        >
            RATE
        </Button>
        {
            session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_USER_EMAIL &&
            <Button type="button"
                    onClick={removeRatesBySubject}
                    className="button--secondary form__button"
                    disabled={!subject || isRemoveRateLoading}
            >
                REMOVE RATE
            </Button>
        }
        {
            (isCreateRateLoading || isRemoveRateLoading) &&
            <Loader className="global-loader" />
        }
    </form>;
};

export default RateForm;
