import React, { useRef } from 'react';
import './styles/main.css';
import { useEffect, useState } from 'react';
import Input from './components/elements/Input';
import Button from './components/elements/Button';
import RateItem from './components/RateItem';
import { createRate as apiCreateRate, getRateList as apiGetRateList, removeRate as apiRemoveRate } from './api/rate';
import { getFromLocalStorage, setToLocalStorage } from './utils';

const App = () => {
    const rateInputRef = useRef();

    const [rates, setRates] = useState();

    const [subject, setSubject] = useState('');
    const [rate, setRate] = useState('');
    const resetForm = () => {
        setRate('');
        setSubject('');
    };
    const changeSubject = subject => {
        setSubject(subject);
        setRate('');
    };

    // todo: some of these validations should be on the server
    const checkIsSubjectAlreadyRated = () => {
        const localStorageUserRates = getFromLocalStorage('userRates');
        if (localStorageUserRates.some(rate => rate.subject === subject)) {
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
    const validatePassword = password => {
        if (!password) {
            alert('Please enter password.');
        }
        const passwordRegex = /^[a-zA-Z0-9_]+$/;
        if (!passwordRegex.test(password)) {
            alert('Incorrect data. Password should contain only letters, numbers or low line.');
            return false;
        }
        return true;
    };
    const checkPassword = rates => {
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
                localStorageUserRates.filter(localStorageRate =>
                    response.rows.some(rate => rate.subject === localStorageRate.subject))
            );
            return response.rows;
        });
    useEffect(() => {
        getRateList();
    }, []);

    const createRate = () => {
        if (validateSubject() && validateRate() && !checkIsSubjectAlreadyRated()) {
            const modifiedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
            apiCreateRate(modifiedSubject, rate)
                .then(() => {
                    const localStorageUserRates = getFromLocalStorage('userRates');
                    setToLocalStorage('userRates', [...localStorageUserRates, { rate, modifiedSubject }]);
                    resetForm();
                    getRateList();
                });
        }
    };

    const removeRate = () => {
        if (validateSubject() && checkIfSubjectExists()) {
            const localStoragePassword = getFromLocalStorage('password');
            const password = localStoragePassword || prompt('Please, enter password');
            if (validatePassword(password)) {
                apiRemoveRate(password, subject).then(() => {
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

    return (
        <div className="app">
            <header className="header">
                Rate Anything
            </header>
            {/*<div className="subheader">*/}
            {/*    <div className="subheader__item">*/}
            {/*        1. if there are already rates of what you type, it will appear in the dropdown.*/}
            {/*    </div>*/}
            {/*    <div className="subheader__item">*/}
            {/*        2. if not, you will be the first who rates that thing.*/}
            {/*    </div>*/}
            {/*    <div className="subheader__item">*/}
            {/*        3. you can rate something people have already rated by clicking a dote on the scale below.*/}
            {/*    </div>*/}
            {/*</div>*/}
            <main className="main">
                <div className="form">
                    <Input placeholder="Input what you wanna rate"
                           className="form__input"
                           selectOnFocus
                           value={subject}
                           onChange={event => changeSubject(event.target.value)}
                    />
                    <Input placeholder="Input your rate"
                           className="form__input form__input--number"
                           inputMode="numeric"
                           selectOnFocus
                           value={rate}
                           onChange={
                               event => ((!event.target.value || event.target.value === '-')
                                   || (/^([-]?[1-9]\d*|0)$/.test(event.target.value) && +event.target.value >= -10 && +event.target.value <= 10))
                                   && setRate(event.target.value)
                           }
                           refValue={rateInputRef}
                    />
                    <Button onClick={createRate} className="form__button">
                        RATE
                    </Button>
                </div>
                <div className="line-chart">
                    <div className="line-chart__main-line" />
                    {
                        Array.from(Array(21).keys()).map((item, index) =>
                            <React.Fragment key={index}>
                                <div className="dash-dote" style={{ left: `${100 / 20 * index}%` }} />
                                <div className="dash-label" style={{ left: `${100 / 20 * index}%` }}>
                                    {+index - 10}
                                </div>
                            </React.Fragment>
                        )
                    }
                    {
                        rates?.map(rate =>
                            <RateItem key={rate.subject}
                                      rate={rate}
                                      onClickRateItem={
                                          () => {
                                              changeSubject(rate.subject);
                                              rateInputRef.current.focus();
                                          }
                                      }
                            />
                        )
                    }
                </div>
                <Button onClick={removeRate} className="button--secondary remove-button">
                    REMOVE RATE
                </Button>
            </main>
        </div>
    );
}

export default App;
