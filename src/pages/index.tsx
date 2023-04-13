import React, { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from '../components/layout/Header';
import { validateRateSubject, validateRateValue } from '../utils/validations';
import RateForm from '../components/rate-form/RateForm';
import RateTable from '../components/rate-table/RateTable';
import { trpc } from '../utils/trpcClient';
import { getQueryKey } from '@trpc/react-query';
import { useQueryClient } from '@tanstack/react-query';

const RatePage = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const rateInputRef = useRef<HTMLInputElement>(null);

    const { data: session } = useSession({
        required: true,
        onUnauthenticated: () => {
            router.push('login');
        }
    });

    const [subject, setSubject] = useState('');
    const [rate, setRate] = useState<number | string>('');
    const changeSubject = (subject: string) => {
        setSubject(subject);
        setRate('');
    };
    const changeRate = (rate: number | string) => {
        if (typeof rate === 'string' || (rate <= 10 && rate >= -10)) {
            setRate(rate);
        }
    };
    const selectSubjectToRate = (subject: string) => {
        setSubject(subject);
        setRate('');
        const rateValueInput = document.getElementById('rate-value-input') as HTMLInputElement;
        rateValueInput?.focus();
    };
    const resetForm = () => {
        setSubject('');
        setRate('');
    };

    const invalidateRateLists = () => {
        queryClient.invalidateQueries({ queryKey: getQueryKey(trpc.rate.getAverageRateList) });
    };
    const onMutationSuccess = () => {
        resetForm();
        invalidateRateLists();
    };

    const createRateMutation = trpc.rate.createRate.useMutation();

    const createRate = () => {
        if (validateRateSubject(subject) && validateRateValue(rate)) {
            createRateMutation.mutate({ subject, rate }, { onSuccess: onMutationSuccess });
        }
    };

    const removeRatesBySubjectMutation = trpc.rate.removeRatesBySubject.useMutation();

    const removeRatesBySubject = () => {
        if (validateRateSubject(subject)) {
            removeRatesBySubjectMutation.mutate({ subject }, { onSuccess: onMutationSuccess });
        }
    };

    if (!session) {
        return null;
    }

    return <div className="main-page-grid">
        <Header className="main-page-grid__header" />
        <div className="main-page-block main-page-block--form custom-scrollbar pan-screen-child">
            <RateForm rateInputRef={rateInputRef}
                      createRate={createRate}
                      subject={subject}
                      changeSubject={changeSubject}
                      rate={rate}
                      changeRate={changeRate}
                      removeRatesBySubject={removeRatesBySubject}
            />
        </div>
        <div className="main-page-block main-page-block--table pan-screen-child">
            <RateTable selectSubjectToRate={selectSubjectToRate} />
        </div>
    </div>;
};

export default RatePage;
