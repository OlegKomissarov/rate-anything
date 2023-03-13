import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '../components/elements/Button';
import Header from "../components/layout/Header";
import StarsBackground from '../components/rate/login/StarsBackground';
import { signIn } from 'next-auth/react';
import { getClassName, Position } from '../utils/utils';
import generateStarsBackgroundData from '../utils/generateStarsBackgroundData';
import useBodyNoScrollBar from "../utils/useBodyNoScrollBar";
import useRateList from "../utils/useRateList";
import {maxSubjectLengthForLoginBackground} from "../utils/loginUtils";

const LoginPage = () => {
    const { averageRateList, getRateList } = useRateList(maxSubjectLengthForLoginBackground);

    useEffect(() => {
        const loadData = async () => {
            const { averageRateList } = await getRateList();
            setBackgroundData(generateStarsBackgroundData(averageRateList.length));
        };
        loadData();
    }, []);

    const onClickSignIn = async () => {
        setShouldAnimateAstronaut(true);
        await signIn('google', { redirect: true, callbackUrl: '/' });
    };

    const [shouldAnimateAstronaut, setShouldAnimateAstronaut] = useState(false);
    const [backgroundData, setBackgroundData] = useState<{ backgroundSize: Position, starPositions: Position[] }>(
        generateStarsBackgroundData(averageRateList.length)
    );
    const { backgroundSize, starPositions } = backgroundData;
    useEffect(() => {
        window.scrollTo((backgroundSize.x - window.innerWidth) / 2, (backgroundSize.y - window.innerHeight) / 2);
    }, [backgroundSize.x, backgroundSize.y]);
    useBodyNoScrollBar();

    return <div className="page login">
        <Header theme="dark"
                className="login__header"
                onMouseDown={event => event.stopPropagation()}
        />
        <Button className="button--dark-theme login__button"
                onMouseDown={event => event.stopPropagation()}
                onClick={onClickSignIn}
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
               onMouseDown={event => event.stopPropagation()}
               onClick={onClickSignIn}
        />
        <StarsBackground backgroundSize={backgroundSize}
                         starPositions={starPositions}
                         averageRateList={averageRateList}
        />
    </div>;
};

export default LoginPage;
