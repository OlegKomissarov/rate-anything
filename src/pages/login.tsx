import React, { useEffect, useState } from 'react';
import Button from '../components/elements/Button';
import { Rate } from '../components/rate/rateUtils';
import { signIn } from 'next-auth/react';
import RateStars from '../components/rate/login/RateStars';
import { validateRateList, validateAverageRateList } from '../components/rate/rateUtils';
import Image from 'next/image';
import { getClassName } from '../utils';

const LoginPage = () => {
    const [rates, setRates] = useState<Rate[]>([]);
    const [averageRates, setAverageRates] = useState<Rate[]>([]);
    const [animateAstronaut, setAnimateAstronaut] = useState(false);

    const getRateList = async () => {
        const response = await fetch('/api/rate', { method: 'GET' });
        const result = await response.json();
        if (response.ok && result && validateRateList(result.rateList) && validateAverageRateList(result.averageRateList)) {
            const rateList = result.rateList;
            const averageRateList = result.averageRateList;
            setRates(rateList);
            setAverageRates(averageRateList);
        }
        if (!response.ok) {
            alert(result?.message || `Failed to get rate list, error code is ${response.status}`);
        }
    };
    useEffect(() => {
        getRateList();
    }, []);

    const onClickSignIn = async () => {
        setAnimateAstronaut(true);
        await signIn('google', { redirect: true, callbackUrl: '/' });
    };

    return <div className="page">
        <Button className="button--dark-theme sign-in-button"
                onClick={onClickSignIn}
        >
            Sign In To Create Your Rate
        </Button>
        <Image src="/astronaut-1.webp"
               alt="Astronaut"
               width={200} height={200}
               className={getClassName(
                   'sign-in-astronaut-image',
                   animateAstronaut && 'sign-in-astronaut-image--animated'
               )}
               onClick={onClickSignIn}
        />
        <div className="stars"></div>
        <div className="twinkling"></div>
        {
            !!averageRates.length &&
            <RateStars rates={rates} averageRates={averageRates} />
        }
    </div>;
};

export default LoginPage;