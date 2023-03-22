import React from 'react';
import Input from '../elements/Input';
import Button from '../elements/Button';
import { useSession } from 'next-auth/react';

const RateForm: React.FC<{
    rateInputRef: React.RefObject<HTMLInputElement>
    createRate: () => void
    subject: string
    changeSubject: (subject: string) => void
    rate: number | string
    changeRate: (rate: number | string) => void
}> = ({ rateInputRef, createRate, subject, changeSubject, rate, changeRate }) => {
    const { data: session } = useSession();

    return <div className="form">
        {
            !!session?.user &&
            <div className="user-name-label">{session.user.name}</div>
        }
        <Input placeholder="Input what you wanna rate"
               className="form__input"
               selectOnFocus
               value={subject}
               onChange={event => changeSubject(event.target.value)}
        />
        <Input placeholder="Input your rate"
               className="form__input form__input--number"
               inputMode="decimal"
               selectOnFocus
               value={rate}
               onChange={event => {
                   if (event.target.value === '' || event.target.value === '-') {
                       changeRate(event.target.value);
                   } else if (/^([-]?[1-9]\d*|0)$/.test(event.target.value)) {
                       const numberValue = +event.target.value;
                       if (numberValue >= -10 && numberValue <= 10) {
                           changeRate(numberValue);
                       }
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
