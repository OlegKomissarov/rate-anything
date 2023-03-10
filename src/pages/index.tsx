import React, { useEffect, useRef, useState } from 'react';
import RateForm from '../components/rate/form/RateForm';
import Button from '../components/elements/Button';
import { Rate } from '../components/rate/rateUtils';
import { useSession } from 'next-auth/react';
import {
    validateRateSubject, validateRateValue, validateRateList, validateAverageRateList, checkIfSubjectExists
} from '../components/rate/rateUtils';
import { useRouter } from 'next/router';

const RatePage = () => {
    const router = useRouter();

    const rateInputRef = useRef<HTMLInputElement>(null);

    const { data: session } = useSession({
        required: true,
        onUnauthenticated: () => { router.push('login') }
    });

    const [rates, setRates] = useState<Rate[]>([]);
    const [averageRates, setAverageRates] = useState<Rate[]>([]);

    const [subject, setSubject] = useState('');
    const [rate, setRate] = useState<string>('');
    const resetForm = () => {
        setSubject('');
        setRate('');
    };

    const getRateList = async () => {
        const response = await fetch('/api/rate', { method: 'GET' });
        const result = await response.json();
        if (response.ok && result && validateRateList(result.rateList) && validateAverageRateList(result.averageRateList)) {
            const rateList = result.rateList;
            const averageRateList = result.averageRateList;
            setRates(rateList);
            setAverageRates(averageRateList);
        }
        if (!response.ok) {
            alert(result?.message || `Failed to get rate list, error code is ${response.status}`);
        }
    };
    useEffect(() => {
        getRateList();
    }, []);

    const createRate = async () => {
        if (validateRateSubject(subject) && validateRateValue(+rate)) {
            const modifiedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
            const response = await fetch('/api/rate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
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
            && validateRateSubject(subject) && checkIfSubjectExists(averageRates, subject)
        ) {
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
                alert(result?.message || `Failed to delete rate, error code is ${response.status}`);
            }
        }
    };

    if (!session) {
        return null;
    }

    return <>
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
        {/*<RateLineChart rates={rates}*/}
        {/*               averageRates={averageRates}*/}
        {/*               changeSubject={*/}
        {/*                   (subject: string) => {*/}
        {/*                       if (!session) {*/}
        {/*                           return;*/}
        {/*                       }*/}
        {/*                       setSubject(subject);*/}
        {/*                       setRate('');*/}
        {/*                       if (rateInputRef.current) {*/}
        {/*                           rateInputRef.current.focus();*/}
        {/*                       }*/}
        {/*                   }*/}
        {/*               }*/}
        {/*/>*/}
        {
            session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_USER_EMAIL &&
            <Button onClick={removeRate} className="button--secondary">
                REMOVE RATE
            </Button>
        }
    </>;
};

export default RatePage;
