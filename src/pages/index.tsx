import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from '../components/layout/Header';
import { validateRateSubject, validateRateValue } from '../utils/validations';
import RateForm from '../components/rate-form/RateForm';
import RateTable from '../components/rate-table/RateTable';
import { trpc } from '../utils/trpcClient';
import { getQueryKey } from '@trpc/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { TRPCClientError } from '@trpc/client';
import { getClassName, isClient, isMobile } from '../utils/utils';
import StarsBackground from '../components/layout/StarsBackground';
import { toast } from 'react-toastify';

const RatePage = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { data: session } = useSession({
        required: true,
        onUnauthenticated: () => {
            router.push('login');
        }
    });

    const [currentMobileScreen, setCurrentMobileScreen] = useState<'form' | 'table'>('form');
    const [screenHeight, setScreenHeight] =
        useState(isClient ? document.documentElement.clientHeight : 0);
    useEffect(() => {
        if (isMobile()) {
            const onResize = () => {
                setScreenHeight(document.documentElement.clientHeight);
            };
            window.addEventListener('resize', onResize);
            return () => {
                window.removeEventListener('resize', onResize);
            };
        }
    }, []);

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
    const focusSubjectInput = () => {
        if (currentMobileScreen !== 'form') {
            setCurrentMobileScreen('form');
        }
        const rateValueInput = document.getElementById('rate-subject-input') as HTMLInputElement;
        rateValueInput?.focus();
    };
    const focusRateInput = () => {
        if (currentMobileScreen !== 'form') {
            setCurrentMobileScreen('form');
        }
        const rateValueInput = document.getElementById('rate-value-input') as HTMLInputElement;
        rateValueInput?.focus();
    };
    const selectSubjectToRate = (subject: string) => {
        setSubject(subject);
        setRate('');
        focusRateInput();
    };
    const resetForm = () => {
        setSubject('');
        setRate('');
    };

    const invalidateRateLists = () => {
        queryClient.invalidateQueries({ queryKey: getQueryKey(trpc.rate.getAverageRateList) });
    };
    const onRateListMutationSuccess = () => {
        resetForm();
        invalidateRateLists();
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
                        focusSubjectInput();
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

    if (!session) {
        return null;
    }

    return <>
        <StarsBackground showStars={!isMobile()} />
        <div className="main-page-grid" style={{ height: isMobile() ? screenHeight : undefined }}>
            <Header className="main-page-grid__header" />
            <div onClick={() => currentMobileScreen !== 'form' && setCurrentMobileScreen('form')}
                 className={
                     getClassName(
                         'main-page-block main-page-block--form pan-screen-child',
                         (isMobile() && currentMobileScreen === 'form') && 'main-page-block--expanded-mobile'
                     )
                 }
            >
                <RateForm createRate={createRate}
                          subject={subject}
                          changeSubject={changeSubject}
                          rate={rate}
                          changeRate={changeRate}
                          removeRatesBySubject={removeRatesBySubject}
                          isCreateRateLoading={createRateMutation.isLoading}
                          isRemoveRateLoading={removeRatesBySubjectMutation.isLoading}
                />
                <div className="main-page-block__expand-icon">
                    <div className="expand-icon" />
                </div>
            </div>
            <div onClick={() => currentMobileScreen !== 'table' && setCurrentMobileScreen('table')}
                 className={
                     getClassName(
                         'main-page-block main-page-block--table pan-screen-child',
                         (isMobile() && currentMobileScreen === 'table') && 'main-page-block--expanded-mobile'
                     )
                 }
            >
                <RateTable selectSubjectToRate={selectSubjectToRate} />
                <div className="main-page-block__expand-icon">
                    <div className="expand-icon" />
                </div>
            </div>
        </div>
    </>;
};

export default RatePage;
