import React from 'react';
import Input from '../elements/Input';
import Button from '../elements/Button';

const RateForm = props => {
    const { rateInputRef, createRate, subject, changeSubject, rate, changeRate } = props;

    return <div className="form">
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
                   event =>
                       (
                           (!event.target.value || event.target.value === '-')
                           || (
                               /^([-]?[1-9]\d*|0)$/.test(event.target.value)
                               && +event.target.value >= -10 && +event.target.value <= 10
                           )
                       )
                       && changeRate(event.target.value)
               }
               refValue={rateInputRef}
        />
        <Button onClick={createRate} className="form__button">
            RATE
        </Button>
    </div>;
}

export default RateForm;
