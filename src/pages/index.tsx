import React, { useEffect, useRef, useState } from 'react';
import { getFromLocalStorage, validate, setToLocalStorage } from '../utils';
import RateLineChart from '../components/rate/RateLineChart';
import RateForm from '../components/rate/RateForm';
import Button from '../components/elements/Button';
import { passwordSchema, Rate, rateListSchema, rateSubjectSchema, rateValueSchema } from '../components/rate/rateUtils';

const RatePage = () => {
    const rateInputRef = useRef<HTMLInputElement>(null);

    const [rates, setRates] = useState<Rate[]>([]);

    const [subject, setSubject] = useState('');
    const [rate, setRate] = useState('');
    const resetForm = () => {
        setSubject('');
        setRate('');
    };

    const validateRateSubject = (subject: unknown): subject is string => validate<string>(subject, rateSubjectSchema);

    const validateRateValue = (rate: unknown): rate is number => validate<number>(rate, rateValueSchema);

    const validateRateList = (rateList: unknown): rateList is Rate[] =>
        validate<Rate[]>(rateList, rateListSchema);

    const validatePassword = (password: unknown): password is string =>
        validate<string>(password, passwordSchema);

    // Todo: this check should be on the server
    const checkIsSubjectAlreadyRated = () => {
        const localStorageUserRates = getFromLocalStorage<Rate[]>('userRates', validateRateList);
        if (localStorageUserRates && localStorageUserRates.some((rate: Rate) => rate.subject === subject)) {
            alert(`You have already rated ${subject}`);
            return true;
        }
        return false;
    };

    // Todo: this check should be on the server
    const checkPassword = (rates: Rate[]) => {
        if (rates.some(rate => rate.subject === subject)) {
            alert('It seems that the password was incorrect');
            localStorage.removeItem('password');
            return false;
        }
        return true;
    };

    const checkIfSubjectExists = () => {
        if (rates.find(rate => rate.subject === subject)) {
            return true;
        }
        alert('There is no such subject. Please provide an existing subject in the input above');
        return false;
    };

    const getRateList = async () => {
        const response = await fetch('/api/rate', { method: 'GET' });
        if (response.ok) {
            const result = await response.json();
            const rateList = result.rows || [];
            setRates(rateList);
            if (validateRateList(rateList)) {
                const localStorageUserRates = getFromLocalStorage<Rate[]>('userRates', validateRateList);
                if (localStorageUserRates) {
                    setToLocalStorage(
                        'userRates',
                        localStorageUserRates?.filter((localStorageRate: Rate) =>
                            rateList.some((rate: Rate) => rate.subject === localStorageRate.subject))
                    );
                }
            }
            return rateList;
        } else {
            alert(`Failed to get rate list, error code is ${response.status}`);
        }
        return [];
    };
    useEffect(() => {
        getRateList();
    }, []);

    const createRate = async () => {
        if (validateRateSubject(subject) && validateRateValue(+rate) && !checkIsSubjectAlreadyRated()) {
            const modifiedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
            const response = await fetch('/api/rate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ subject: modifiedSubject, rate })
            });
            if (response.ok) {
                resetForm();
                const newUserRate = { subject: modifiedSubject, rate };
                const localStorageUserRates = getFromLocalStorage<Rate[]>('userRates', validateRateList);
                const userRates = localStorageUserRates ? [...localStorageUserRates, newUserRate] : [newUserRate]
                setToLocalStorage('userRates', userRates);
                getRateList();
            } else {
                alert(`Failed to create rate, error code is ${response.status}`);
            }
        }
    };

    const removeRate = async () => {
        if (validateRateSubject(subject) && checkIfSubjectExists()) {
            const localStoragePassword = getFromLocalStorage<string>('password', validatePassword);
            const password = localStoragePassword || prompt('Please, enter password');
            if (validatePassword(password)) {
                const response = await fetch('/api/rate', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ subject, password })
                });
                if (response.ok) {
                    const rateList = await getRateList();
                    if (checkPassword(rateList)) {
                        setToLocalStorage('password', password);
                        resetForm();
                    }
                } else {
                    alert(`Failed to delete rate, error code is ${response.status}`);
                }
            }
        }
    };

    return <>
        <RateForm rateInputRef={rateInputRef}
                  createRate={createRate}
                  subject={subject}
                  changeSubject={
                      (subject: string) => {
                          setSubject(subject);
                          setRate('');
                      }
                  }
                  rate={rate}
                  changeRate={setRate}
        />
        <RateLineChart rates={rates}
                       changeSubject={
                           (subject: string) => {
                               setSubject(subject);
                               setRate('');
                               if (rateInputRef.current) {
                                   rateInputRef.current.focus();
                               }
                           }
                       }
        />
        <Button onClick={removeRate} className="button--secondary remove-button">
            REMOVE RATE
        </Button>
    </>;
};

export default RatePage;
