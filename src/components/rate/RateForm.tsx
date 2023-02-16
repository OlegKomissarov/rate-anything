import React from 'react';
import Input from '../elements/Input';
import Button from '../elements/Button';

const RateForm: React.FC<{
    rateInputRef: React.Ref<HTMLInputElement>
    createRate: () => void
    subject: string
    changeSubject: (subject: string) => void
    rate: string
    changeRate: (rate: string) => void
}> = ({ rateInputRef, createRate, subject, changeSubject, rate, changeRate }) => {
    return <div className="form">
        <Input placeholder="Input what you wanna rate"
               className="form__input"
               selectOnFocus
               value={subject}
               onChange={(event: React.ChangeEvent<HTMLInputElement>) => changeSubject(event.target.value)}
        />
        <Input placeholder="Input your rate"
               className="form__input form__input--number"
               inputMode="numeric"
               selectOnFocus
               value={rate}
               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                   const { value } = event.target;
                   if ((!value || value === '-') || /^([-]?[1-9]\d*|0)$/.test(value) && +value >= -10 && +value <= 10) {
                       changeRate(value);
                   }
               }}
               refValue={rateInputRef}
        />
        <Button onClick={createRate} className="form__button">
            RATE
        </Button>
    </div>;
};

export default RateForm;
