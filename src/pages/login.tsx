import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '../components/elements/Button';
import Header from '../components/layout/Header';
import StarsBackground from '../components/login/StarsBackground';
import { signIn } from 'next-auth/react';
import { getClassName, isClient } from '../utils/utils';

const LoginPage = () => {
    const [shouldAnimateAstronaut, setShouldAnimateAstronaut] = useState(false);
    const [isAnimatedAstronaut, setIsAnimatedAstronaut] = useState(false);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        setInterval(() => setCounter(counter => counter + 1), 1000);
    }, []);

    const onClickSignIn = async () => {
        setShouldAnimateAstronaut(true);
        await signIn('google', { redirect: true, callbackUrl: '/' });
    };

    return <div className="page login">
        <Header theme="dark"
                className="login__header"
                onMouseDown={event => event.stopPropagation()}
        />
        <Button className="button--theme--dark login__button"
                onMouseDown={event => event.stopPropagation()}
                onClick={onClickSignIn}
        >
            Sign In To Create Your Rate
        </Button>
        <div style={{ position: 'fixed', left: '25px', top: '75px', color: 'white', zIndex: 99999 }}>
            {counter}
        </div>
        <div style={{ position: 'fixed', left: '25px', top: '25px', color: 'white', zIndex: 99999 }}>
            {
                isClient
                && document.querySelector('.login__astronaut')
                // @ts-ignore
                && document.querySelector('.login__astronaut').classList
                // @ts-ignore
                && JSON.stringify(document.querySelector('.login__astronaut').classList)        }
        </div>
        <Image src="/astronaut.webp"
               alt="Astronaut"
               width={200} height={200}
               className={getClassName(
                   'login__astronaut',
                   shouldAnimateAstronaut && 'login__astronaut--animating',
                   isAnimatedAstronaut && 'login__astronaut--animated'
               )}
               onMouseDown={event => event.stopPropagation()}
               onClick={onClickSignIn}
               priority
               onAnimationEnd={() => setIsAnimatedAstronaut(true)}
        />
        <StarsBackground otherElements={isClient ? [
            document.querySelector('.login__button')!,
            document.querySelector('.login__astronaut')!,
            document.querySelector('.header')!
        ] : []}
        />
    </div>;
};

export default LoginPage;
