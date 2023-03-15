import React, { useEffect, useRef, useState } from 'react';
import Button from '../components/elements/Button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from '../components/layout/Header';
import { useRateList } from '../utils/useDataHooks';
import { checkIfSubjectExists, validateRateSubject, validateRateValue } from '../utils/validations';
import RateForm from '../components/rate-form/RateForm';
import RateTable from '../components/rate-table/RateTable';
import RateLineChart from '../components/rate-form/RateLineChart';

const RatePage = () => {
    const router = useRouter();

    const rateInputRef = useRef<HTMLInputElement>(null);

    const { data: session } = useSession({
        required: true,
        onUnauthenticated: () => {
            router.push('login');
        }
    });

    const { rateList, averageRateList, getRateList } = useRateList();

    const [subject, setSubject] = useState('');
    const [rate, setRate] = useState<string>('');
    const resetForm = () => {
        setSubject('');
        setRate('');
    };

    useEffect(() => {
        getRateList();
    }, []);

    const createRate = async () => {
        if (validateRateSubject(subject) && validateRateValue(rate)) {
            const modifiedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
            const response = await fetch('/api/rate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject: modifiedSubject, rate: +rate })
            });
            if (response.ok) {
                resetForm();
                getRateList();
            } else {
                const result = await response.json();
                alert(result?.message || `Failed to create rate, error code is ${response.status}`);
            }
        }
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
                resetForm();
                getRateList();
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
        <RateLineChart rateList={rateList}
                       averageRateList={averageRateList}
                       changeSubject={
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
        <RateTable rateList={rateList} averageRateList={averageRateList} />
    </>;
};

export default RatePage;
