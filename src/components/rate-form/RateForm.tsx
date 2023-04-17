import React from 'react';
import Input from '../elements/Input';
import Button from '../elements/Button';
import { useSession } from 'next-auth/react';
import InputWithSuggestions from '../elements/InputWithSuggestions';
import { trpc } from '../../utils/trpcClient';
import { isMobile, useDisableBodyScroll } from '../../utils/utils';
import Loader from '../layout/Loader';
import NumberSelectionSlider from '../elements/NumberSelectionSlider';
import { getQueryKey } from '@trpc/react-query';
import { validateRateSubject, validateRateValue } from '../../utils/validations';
import { toast } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';
import { useQueryClient } from '@tanstack/react-query';
import useRateFormStore from './useRateFormStore';

const RateForm = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    const scrollableElementRef = useDisableBodyScroll();

    const subject = useRateFormStore(state => state.subject);
    const changeSubject = useRateFormStore(state => state.changeSubject);
    const rate = useRateFormStore(state => state.rate);
    const changeRate = useRateFormStore(state => state.changeRate);
    const resetForm = useRateFormStore(state => state.resetForm);

    const onRateListMutationSuccess = () => {
        resetForm();
        queryClient.invalidateQueries({ queryKey: getQueryKey(trpc.rate.getAverageRateList) });
    };

    const createRateMutation = trpc.rate.createRate.useMutation();
    const createRate = () => {
        if (validateRateSubject(subject) && validateRateValue(rate)) {
            createRateMutation.mutate({ subject, rate }, {
                onSuccess: response => {
                    toast(
                        `Your rate for ${response.averageRate.subject} is recorded. New average rate is ${response.averageRate.averageRate}.`,
                        { type: 'success' }
                    );
                    onRateListMutationSuccess();
                },
                onError: error => {
                    if (error instanceof TRPCClientError && error.data.code === 'FORBIDDEN') {
                        resetForm();
                        const rateValueInput = document.getElementById('rate-subject-input') as HTMLInputElement;
                        rateValueInput?.focus();
                    }
                }
            });
        }
    };

    const removeRatesBySubjectMutation = trpc.rate.removeRatesBySubject.useMutation();
    const removeRatesBySubject = () => {
        if (validateRateSubject(subject)) {
            removeRatesBySubjectMutation.mutate({ subject },
                {
                    onSuccess: () => {
                        toast(
                            `All rates for ${subject} are successfully removed (if there were any).`,
                            { type: 'success' }
                        );
                        onRateListMutationSuccess();
                    }
                }
            );
        }
    };

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
        <InputWithSuggestions id="rate-subject-input"
                              placeholder="What You Wanna Rate"
                              className="form__input"
                              selectOnFocus
                              value={subject}
                              onChange={event => changeSubject(event.target.value)}
                              selectSuggestion={changeSubject}
                              suggestionListQuery={trpc.rate.getAverageRateList.useQuery}
                              suggestionKeyField="subject"
        />
        <Input id="rate-value-input"
               placeholder="Your Rate from -10 to 10"
               className="form__input"
               selectOnFocus
               value={rate}
               onChange={event => changeRate(event.target.value)}
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
                disabled={!subject || typeof rate !== 'number' || createRateMutation.isLoading }
        >
            RATE
        </Button>
        {
            session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_USER_EMAIL &&
            <Button type="button"
                    onClick={removeRatesBySubject}
                    className="button--secondary form__button"
                    disabled={!subject || removeRatesBySubjectMutation.isLoading}
            >
                REMOVE RATE
            </Button>
        }
        {
            (createRateMutation.isLoading || removeRatesBySubjectMutation.isLoading) &&
            <Loader className="global-loader" />
        }
    </form>;
};

export default RateForm;
