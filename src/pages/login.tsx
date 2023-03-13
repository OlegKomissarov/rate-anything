import React, { useEffect, useRef, useState } from 'react';
import Button from '../components/elements/Button';
import {maxSubjectLengthForLoginBackground, Rate} from '../components/rate/rateUtils';
import { signIn } from 'next-auth/react';
import { validateAverageRateList } from '../components/rate/rateUtils';
import Image from 'next/image';
import { getClassName, Position } from '../utils/utils';
import StarsBackground from '../components/rate/login/StarsBackground';
import generateStarsBackgroundData from '../utils/generateStarsBackgroundData';
import Header from "../components/layout/Header";
import useBodyNoScrollBar from "../utils/useBodyNoScrollBar";

const LoginPage = () => {
    const [averageRates, setAverageRates] = useState<Rate[]>([]);

    const getRateList = async () => {
        const response = await fetch(
            `/api/rate?maxSubjectLength=${maxSubjectLengthForLoginBackground}`,
            { method: 'GET' }
        );
        const result = await response.json();
        if (response.ok && result && validateAverageRateList(result.averageRateList)) {
            const averageRateList = result.averageRateList;
            setBackgroundData(generateStarsBackgroundData(averageRateList.length));
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
        setShouldAnimateAstronaut(true);
        await signIn('google', { redirect: true, callbackUrl: '/' });
    };

    const [shouldAnimateAstronaut, setShouldAnimateAstronaut] = useState(false);
    const [backgroundData, setBackgroundData] = useState<{ backgroundSize: Position, starPositions: Position[] }>(
        generateStarsBackgroundData(averageRates.length)
    );
    const { backgroundSize, starPositions } = backgroundData;
    useEffect(() => {
        window.scrollTo((backgroundSize.x - window.innerWidth) / 2, (backgroundSize.y - window.innerHeight) / 2);
    }, [backgroundSize.x, backgroundSize.y]);
    useBodyNoScrollBar();

    // todo: remove unnecessary event listeners here and other places
    return <div className="page login">
        <Header theme="dark"
                className="login__header"
                onTouchMove={event => { event.preventDefault(); event.stopPropagation(); }}
                onMouseMove={event => { event.preventDefault(); event.stopPropagation(); }}
                onTouchStart={event => event.stopPropagation()}
                onMouseDown={event => event.stopPropagation()}
                onTouchEnd={event => event.stopPropagation()}
                onMouseUp={event => event.stopPropagation()}
        />
        <Button className="button--dark-theme login__button"
                onClick={onClickSignIn}
                onTouchMove={event => { event.preventDefault(); event.stopPropagation(); }}
                onMouseMove={event => { event.preventDefault(); event.stopPropagation(); }}
                onTouchStart={event => event.stopPropagation()}
                onMouseDown={event => event.stopPropagation()}
                onTouchEnd={event => event.stopPropagation()}
                onMouseUp={event => event.stopPropagation()}
        >
            Sign In To Create Your Rate
        </Button>
        <Image src="/astronaut-1.webp"
               alt="Astronaut"
               width={200} height={200}
               className={getClassName(
                   'login__astronaut',
                   shouldAnimateAstronaut && 'login__astronaut--animated'
               )}
               onClick={onClickSignIn}
               onTouchMove={event => { event.preventDefault(); event.stopPropagation(); }}
               onMouseMove={event => { event.preventDefault(); event.stopPropagation(); }}
               onTouchStart={event => event.stopPropagation()}
               onMouseDown={event => event.stopPropagation()}
               onTouchEnd={event => event.stopPropagation()}
               onMouseUp={event => event.stopPropagation()}
        />
        <StarsBackground backgroundSize={backgroundSize}
                         starPositions={starPositions}
                         averageRates={averageRates}
        />
    </div>;
};

export default LoginPage;
