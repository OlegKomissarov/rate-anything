import React, { useEffect, useRef, useState } from 'react';
import { validate } from '../utils';
import RateLineChart from '../components/rate/RateLineChart';
import RateForm from '../components/rate/RateForm';
import Button from '../components/elements/Button';
import {
    Rate, averageRateListSchema, rateListSchema, rateSubjectSchema, rateValueSchema
} from '../components/rate/rateUtils';
import { useSession, signIn } from 'next-auth/react';

const RatePage = () => {
    const rateInputRef = useRef<HTMLInputElement>(null);

    const { data: session } = useSession();

    const [rates, setRates] = useState<Rate[]>([]);
    const [averageRates, setAverageRates] = useState<Rate[]>([]);

    const [subject, setSubject] = useState('');
    const [rate, setRate] = useState<number | null>(null);
    const resetForm = () => {
        setSubject('');
        setRate(null);
    };

    const validateRateSubject = (subject: unknown): subject is string => validate<string>(subject, rateSubjectSchema);

    const validateRateValue = (rate: unknown): rate is number => validate<number>(rate, rateValueSchema);

    const validateRateList = (rateList: unknown): rateList is Rate[] => validate<Rate[]>(rateList, rateListSchema);

    const validateAverageRateList = (rateList: unknown): rateList is Rate[] => validate<Rate[]>(rateList, averageRateListSchema);

    const checkIfSubjectExists = () => {
        if (averageRates.find(rate => rate.subject === subject)) {
            return true;
        }
        alert('There is no such subject. Please provide an existing subject in the input above');
        return false;
    };

    const getRateList = async () => {
        const response = await fetch('/api/rate', { method: 'GET' });
        const result = await response.json();
        if (response.ok && validateRateList(result.rateList) && validateAverageRateList(result.averageRateList)) {
            const rateList = result.rateList;
            const averageRateList = result.averageRateList;
            setRates(rateList);
            setAverageRates(averageRateList);
        }
        if (!response.ok) {
            alert(result.message || `Failed to get rate list, error code is ${response.status}`);
        }
    };
    useEffect(() => {
        getRateList();
    }, []);

    const createRate = async () => {
        if (validateRateSubject(subject) && validateRateValue(rate)) {
            const modifiedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
            const response = await fetch('/api/rate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ subject: modifiedSubject, rate })
            });
            if (response.ok) {
                resetForm();
                getRateList();
            } else {
                const result = await response.json();
                alert(result.message || `Failed to create rate, error code is ${response.status}`);
            }
        }
    };

    const removeRate = async () => {
        if (validateRateSubject(subject) && checkIfSubjectExists()) {
            const response = await fetch('/api/rate', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ subject })
            });
            if (response.ok) {
                resetForm();
                getRateList();
            } else {
                const result = await response.json();
                alert(result.message || `Failed to delete rate, error code is ${response.status}`);
            }
        }
    };

    return <>
        {
            session
                ? <RateForm rateInputRef={rateInputRef}
                            createRate={createRate}
                            subject={subject}
                            changeSubject={
                                (subject: string) => {
                                    if (!session) {
                                        return;
                                    }
                                    setSubject(subject);
                                    setRate(null);
                                }
                            }
                            rate={rate}
                            changeRate={setRate}
                />
                : <Button onClick={() => signIn()}>
                    Sign In To Create Your Rate
                </Button>
        }
        <RateLineChart rates={rates}
                       averageRates={averageRates}
                       changeSubject={
                           (subject: string) => {
                               if (!session) {
                                   return;
                               }
                               setSubject(subject);
                               setRate(null);
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
    </>;
};

export default RatePage;
