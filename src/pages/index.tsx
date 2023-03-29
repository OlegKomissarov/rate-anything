import React, { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from '../components/layout/Header';
import { validateRateSubject, validateRateValue } from '../utils/validations';
import RateForm from '../components/rate-form/RateForm';
import RateTable from '../components/rate-table/RateTable';
import RateLineChart from '../components/rate-chart/RateLineChart';
import { trpc } from '../utils/trpcClient';
import { getQueryKey } from '@trpc/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { showError } from '../utils/utils';
import { average_rate } from '@prisma/client';

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

    const { data: averageRateList } = trpc.rate.getAverageRateList.useQuery();

    const [subject, setSubject] = useState('');
    const [rate, setRate] = useState<number | string>('');

    const resetForm = () => {
        setSubject('');
        setRate('');
    };
    const invalidateRateLists = () => {
        queryClient.invalidateQueries({ queryKey: getQueryKey(trpc.rate.getRateList) });
        queryClient.invalidateQueries({ queryKey: getQueryKey(trpc.rate.getAverageRateList) });
    };
    const onMutationSuccess = () => {
        resetForm();
        invalidateRateLists();
    }

    const createRateMutation = trpc.rate.createRate.useMutation();

    const createRate = () => {
        if (validateRateSubject(subject) && validateRateValue(rate)) {
            createRateMutation.mutate({ subject, rate }, { onSuccess: onMutationSuccess });
        }
    };

    const removeRatesBySubjectMutation = trpc.rate.removeRatesBySubject.useMutation();

    const checkIfSubjectExists = (averageRateList: average_rate[] | undefined, subject: string) => {
        if (averageRateList?.find(averageRate => averageRate.subject === subject)) {
            return true;
        }
        showError('There is no such subject. Please provide an existing subject in the input above.');
        return false;
    };

    const removeRatesBySubject = () => {
        if (validateRateSubject(subject) && checkIfSubjectExists(averageRateList, subject)) {
            removeRatesBySubjectMutation.mutate({ subject }, { onSuccess: onMutationSuccess });
        }
    };

    if (!session) {
        return null;
    }

    return <div className="main-page-grid">
        <Header className="main-page-grid__header" />
        <div className="main-page-block main-page-block--form">
            <RateForm rateInputRef={rateInputRef}
                      createRate={createRate}
                      subject={subject}
                      changeSubject={
                          (subject: string) => {
                              if (!session) {
                                  return;
                              }
                              setSubject(subject);
                              setRate('');
                          }
                      }
                      rate={rate}
                      changeRate={setRate}
                      removeRatesBySubject={removeRatesBySubject}
            />
        </div>
        <div className="main-page-block main-page-block--chart">
            <RateLineChart changeSubject={
                (subject: string) => {
                    if (!session) {
                        return;
                    }
                    setSubject(subject);
                    setRate('');
                    if (rateInputRef.current) {
                        rateInputRef.current.focus();
                    }
                }
            }
            />
        </div>
        <div className="main-page-block main-page-block--table">
            <RateTable />
        </div>
    </div>;
};

export default RatePage;
