import React, { useEffect, useRef, useState } from 'react';
import { getFromLocalStorage, setToLocalStorage } from '../../utils';
import {
    createRate as apiCreateRate, getRateList as apiGetRateList, removeRate as apiRemoveRate
} from '../../api/rate';
import RateLineChart from './RateLineChart';
import RateForm from './RateForm';
import Button from '../elements/Button';
import { Rate, validatePassword, validateRateList } from "./rateUtils";

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
        const localStorageUserRates = getFromLocalStorage<Rate[]>('userRates', validateRateList,);
        if (localStorageUserRates && localStorageUserRates.some((rate: Rate) => rate.subject === subject)) {
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

    const getRateList = () =>
        apiGetRateList().then(response => {
            console.log(response);
            setRates(response);
            const localStorageUserRates = getFromLocalStorage<Rate[]>('userRates', validateRateList);
            if (localStorageUserRates) {
                setToLocalStorage(
                    'userRates',
                    localStorageUserRates?.filter((localStorageRate: Rate) =>
                        response.some((rate: Rate) => rate.subject === localStorageRate.subject))
                );
            }
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
                    const newUserRate = { subject: modifiedSubject, rate };
                    const localStorageUserRates = getFromLocalStorage<Rate[]>('userRates', validateRateList);
                    const userRates = localStorageUserRates ? [...localStorageUserRates, newUserRate] : [newUserRate]
                    setToLocalStorage('userRates', userRates);
                    resetForm();
                    getRateList();
                });
        }
    };

    const removeRate = () => {
        if (validateSubject() && checkIfSubjectExists()) {
            const localStoragePassword = getFromLocalStorage<string>('password', validatePassword);
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
};

export default RatePage;
