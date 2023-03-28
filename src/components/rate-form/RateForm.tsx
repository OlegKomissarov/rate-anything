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
    removeRatesBySubject: () => void
}> = ({ rateInputRef, createRate, subject, changeSubject, rate, changeRate, removeRatesBySubject }) => {
    const { data: session } = useSession();

    return <div className="form">
        {
            !!session?.user &&
            <div className="form__user-name-label">{session.user.name}</div>
        }
        <Input placeholder="Input what you wanna rate"
               className="form__input"
               selectOnFocus
               value={subject}
               onChange={event => changeSubject(event.target.value)}
        />
        <Input placeholder="Input your rate from -10 to 10"
               className="form__input"
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
        {
            session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_USER_EMAIL &&
            <Button onClick={removeRatesBySubject} className="button--secondary">
                REMOVE RATE
            </Button>
        }
    </div>;
};

export default RateForm;
