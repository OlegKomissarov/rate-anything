import React, { useRef } from 'react';
import './styles/main.css';
import { useEffect, useState } from 'react';
import api from './api';
import Input from './components/elements/Input';
import Button from './components/elements/Button';

function App() {
    const rateInputRef = useRef();

    const [rates, setRates] = useState();
    const [subject, setSubject] = useState('');
    const [rate, setRate] = useState('');

    const getRateList = () =>
        // api.call('SELECT * FROM rates').then(response => {
        api.call('SELECT subject, CAST(ROUND(AVG(rate), 2) as FLOAT) as rate FROM rates GROUP BY subject').then(response => {
            console.log(response.rows);
            setRates(response.rows);
        });

    useEffect(() => {
        getRateList();
    }, []);

    const postRate = () => {
        api.call(`INSERT INTO rates (\`subject\`, \`rate\`) VALUES (\'${subject}\', ${rate});`)
            .then(() => {
                setRate('');
                setSubject('');
                return getRateList();
            });
    };

    const changeSubject = subject => {
        setSubject(subject);
        setRate('');
    };

    return (
        <div className="app">
            <header className="header">
                Rate Anything
            </header>
            <div className="subheader">
                <div className="subheader__item">
                    1. if there are already rates of what you type, it will appear in the dropdown.
                </div>
                <div className="subheader__item">
                    2. if not, you will be the first who rates that thing.
                </div>
                <div className="subheader__item">
                    3. you can rate something people have already rated by clicking a dote on the scale below.
                </div>
            </div>
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
                    <Button onClick={postRate}>
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
                            <div key={rate.subject}
                                 onClick={
                                     () => {
                                         changeSubject(rate.subject);
                                         rateInputRef.current.focus();
                                     }
                                 }
                                 className="rate"
                                 style={{ left: `${100 / 20 * (rate.rate + 10)}%` }}
                            >
                                <div className="rate-hover-block">
                                    <div className="rate-hover-block__subject"><b>{rate.subject}</b></div>
                                    <div className="rate-hover-block__rate">Rate: <b>{rate.rate}</b></div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </main>
        </div>
    );
}

export default App;
