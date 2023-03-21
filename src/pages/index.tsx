import React, { useRef, useState } from 'react';
import Button from '../components/elements/Button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from '../components/layout/Header';
import { validateRateSubject, validateRateValue } from '../utils/validations';
import RateForm from '../components/rate-form/RateForm';
import RateTable from '../components/rate-table/RateTable';
import RateLineChart from '../components/rate-form/RateLineChart';
import { trpc } from '../utils/trpcClient';
import { getQueryKey } from '@trpc/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { AverageRate } from '../utils/utils';

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
    const [rate, setRate] = useState<string>('');

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
            createRateMutation.mutate({ subject, rate: +rate }, { onSuccess: onMutationSuccess });
        }
    };

    const checkIfSubjectExists = (averageRateList: AverageRate[] | undefined, subject: string) => {
        if (averageRateList?.find(averageRate => averageRate.subject === subject)) {
            return true;
        }
        alert('There is no such subject. Please provide an existing subject in the input above');
        return false;
    };

    const removeRate = async () => {
        if (
            session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_USER_EMAIL
            && validateRateSubject(subject) && checkIfSubjectExists(averageRateList, subject)
        ) {
            const response = await fetch('/api/rate', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject })
            });
            if (response.ok) {
                onMutationSuccess();
            } else {
                const result = await response.json();
                alert(result?.message || `Failed to delete rate, error code is ${response.status}`);
            }
        }
    };

    if (!session) {
        return null;
    }

    return <>
        <Header theme="light" />
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
        />
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
        {
            session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_USER_EMAIL &&
            <Button onClick={removeRate} className="button--secondary">
                REMOVE RATE
            </Button>
        }
        <RateTable />
    </>;
};

export default RatePage;
