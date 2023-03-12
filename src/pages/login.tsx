import React, { useEffect, useRef, useState } from 'react';
import Button from '../components/elements/Button';
import { Rate } from '../components/rate/rateUtils';
import { signIn } from 'next-auth/react';
import { validateAverageRateList } from '../components/rate/rateUtils';
import Image from 'next/image';
import { getClassName, Position } from '../utils';
import StarsBackground from '../components/rate/login/StarsBackground';
import generateStarsBackgroundData from '../generateStarsBackgroundData';

const LoginPage = () => {
    const [averageRates, setAverageRates] = useState<Rate[]>([]);
    const [animateAstronaut, setAnimateAstronaut] = useState(false);

    const backgroundData = useRef<{ backgroundSize: Position, starPositions: Position[] }>(
        generateStarsBackgroundData(averageRates.length)
    );
    const { current: { backgroundSize, starPositions } } = backgroundData;
    const [panPos, setPanPos] = useState<Position>({ x: 0, y: 0 });

    const getRateList = async () => {
        const response = await fetch('/api/rate', { method: 'GET' });
        const result = await response.json();
        if (response.ok && result && validateAverageRateList(result.averageRateList)) {
            const averageRateList = result.averageRateList;
            const newBackgroundData = generateStarsBackgroundData(averageRateList.length);
            backgroundData.current = newBackgroundData;
            setPanPos({
                x: (window.innerWidth - newBackgroundData.backgroundSize.x) / 2,
                y: (window.innerHeight - newBackgroundData.backgroundSize.y) / 2
            });
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
                onTouchMove={event => { event.preventDefault(); event.stopPropagation(); }}
                onMouseMove={event => { event.preventDefault(); event.stopPropagation(); }}
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
               onTouchMove={event => { event.preventDefault(); event.stopPropagation(); }}
               onMouseMove={event => { event.preventDefault(); event.stopPropagation(); }}
        />
        <StarsBackground backgroundSize={backgroundSize}
                         starPositions={starPositions}
                         averageRates={averageRates}
                         panPos={panPos}
                         setPanPos={setPanPos}
        />
    </div>;
};

export default LoginPage;
