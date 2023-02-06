import React, { useRef } from 'react';
import './styles/main.css';
import { useEffect, useState } from 'react';
import api from './api';
import Input from './components/elements/Input';
import Button from './components/elements/Button';
import RateItem from './components/RateItem';
import { getRateList as apiGetRateList } from './api/rate';
import { getFromLocalStorage, setToLocalStorage } from './utils';

const App = () => {
    const rateInputRef = useRef();

    const [rates, setRates] = useState();
    const [subject, setSubject] = useState('');
    const [rate, setRate] = useState('');

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

    const postRate = () => {
        if (subject && rate) {
            const localStorageUserRates = getFromLocalStorage('userRates');
            if (localStorageUserRates.some(rate => rate.subject === subject)) {
                return alert(`You have already rated ${subject}`);
            }

            const subjectRegex = /^[a-zA-Z0-9]+$/; // this validation should be on the server
            if (!subjectRegex.test(subject)) {
                return alert('Incorrect data. Subject should contain only letters or numbers.');
            }
            if (isNaN(+rate)) {
                return alert('Incorrect data. Rate should be a correct number.');
            }

            const modifiedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
            api.call(`INSERT INTO rates (\`subject\`, \`rate\`) VALUES (?, ?);`, [modifiedSubject, rate])
                .then(() => {
                    setToLocalStorage('userRates', [...localStorageUserRates, { rate, modifiedSubject }]);
                    setRate('');
                    setSubject('');
                    return getRateList();
                });
        } else {
            alert('Please, enter correct subject and rate');
        }
    };

    const changeSubject = subject => {
        setSubject(subject);
        setRate('');
    };

    const removeRateBySelectedSubject = () => {
        if (subject && rates.find(rate => rate.subject === subject)) {
            const localStoragePassword = getFromLocalStorage('password');
            const password = localStoragePassword || prompt('Please, enter password');
            if (password) {
                const passwordRegex = /^[a-zA-Z0-9_]+$/;
                if (!passwordRegex.test(password)) { // this validation should be on the server
                    return alert('Incorrect data. Password should contain only letters, numbers or lower case sigh.');
                    // return res.status(400).json({ err: "Incorrect data"});
                }
                const subjectRegex = /^[a-zA-Z0-9]+$/;
                if (!subjectRegex.test(subject)) {
                    return alert('Incorrect data. Subject should contain only letters or numbers.');
                }
                api.call(`
                    DELETE FROM rates WHERE subject = ?
                    AND EXISTS (SELECT 1 FROM passwords WHERE password = ?);
                `, [subject, password]).then(() => {
                    getRateList().then(rates => {
                        if (rates.some(rate => rate.subject === subject)) {
                            alert('It seems that the password was incorrect');
                            if (localStoragePassword) {
                                setToLocalStorage('password', null);
                            }
                        } else {
                            setToLocalStorage('password', password);
                            setSubject('');
                            setRate('');
                        }
                    });
                });
            } else {
                alert('It seems that the password was incorrect');
            }
        } else {
            alert('Please, enter correct subject to remove above');
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
                    <Button onClick={postRate} className="form__button">
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
                <Button onClick={removeRateBySelectedSubject} className="button--secondary remove-button">
                    REMOVE RATE
                </Button>
            </main>
        </div>
    );
}

export default App;
