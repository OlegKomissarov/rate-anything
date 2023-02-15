import React, { useEffect, useRef, useState } from 'react';
import { getFromLocalStorage, setToLocalStorage } from '../../utils';
import {
    createRate as apiCreateRate, getRateList as apiGetRateList, removeRate as apiRemoveRate
} from '../../api/rate';
import RateLineChart from './RateLineChart';
import RateForm from './RateForm';
import Button from '../elements/Button';
import { Rate } from './rateInterfaces';

const RatePage = () => {
    const rateInputRef = useRef(null);

    const [rates, setRates] = useState<Rate[]>([]);

    const [subject, setSubject] = useState('');
    const [rate, setRate] = useState('');
    const resetForm = () => {
        setSubject('');
        setRate('');
    };

    // todo: some of these validations should be on the server
    const checkIsSubjectAlreadyRated = () => {
        const localStorageUserRates = getFromLocalStorage('userRates');
        if (localStorageUserRates?.length && localStorageUserRates.some((rate: Rate) => rate.subject === subject)) {
            alert(`You have already rated ${subject}`);
            return true;
        }
        return false;
    };
    const validateSubject = () => {
        const subjectRegex = /^[a-zA-Z0-9]+$/;
        if (!subject) {
            alert('Please enter subject.');
            return false;
        }
        if (!subjectRegex.test(subject)) {
            alert('Incorrect subject. Subject should contain only letters or numbers.');
            return false;
        }
        return true;
    };
    const validateRate = () => {
        if (!rate) {
            alert('Please enter rate.');
            return false;
        }
        if (isNaN(+rate)) {
            alert('Incorrect rate. Rate should be a correct number.');
            return false;
        }
        return true;
    };
    const validatePassword = (password: string | null) => {
        if (!password) {
            alert('Please enter password.');
        }
        const passwordRegex = /^[a-zA-Z0-9_]+$/;

        if (!passwordRegex.test(password!)) {
            alert('Incorrect data. Password should contain only letters, numbers or low line.');
            return false;
        }
        return true;
    };

    const checkPassword = (rates: Rate[]) => {
        if (rates.some(rate => rate.subject === subject)) {
            alert('It seems that the password was incorrect');
            setToLocalStorage('password', null);
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

    const getRateList = () =>
        apiGetRateList().then(response => {
            console.log(response);
            setRates(response);
            const localStorageUserRates = getFromLocalStorage('userRates');
            setToLocalStorage(
                'userRates',
                localStorageUserRates?.filter((localStorageRate: Rate) =>
                    response.some((rate: Rate) => rate.subject === localStorageRate.subject))
            );
            return response;
        });
    useEffect(() => {
        getRateList();
    }, []);

    const createRate = () => {
        if (validateSubject() && validateRate() && !checkIsSubjectAlreadyRated()) {
            const modifiedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
            apiCreateRate(modifiedSubject, rate)
                .then(() => {
                    const localStorageUserRates: Rate[] = getFromLocalStorage('userRates');
                    setToLocalStorage(
                        'userRates',
                        [...localStorageUserRates, { subject: modifiedSubject, rate }]
                    );
                    resetForm();
                    getRateList();
                });
        }
    };

    const removeRate = () => {
        if (validateSubject() && checkIfSubjectExists()) {
            const localStoragePassword: string = getFromLocalStorage('password');
            const password = localStoragePassword || prompt('Please, enter password');
            if (validatePassword(password)) {
                apiRemoveRate(subject, password!).then(() => {
                    getRateList().then(rates => {
                        if (checkPassword(rates)) {
                            setToLocalStorage('password', password);
                            resetForm();
                        }
                    });
                });
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
                                   (rateInputRef.current as HTMLInputElement).focus();
                               }
                           }
                       }
        />
        <Button onClick={removeRate} className="button--secondary remove-button">
            REMOVE RATE
        </Button>
    </>;
}

export default RatePage;
