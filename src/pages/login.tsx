import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '../components/elements/Button';
import Header from '../components/layout/Header';
import StarsBackground from '../components/login/StarsBackground';
import { signIn, useSession } from 'next-auth/react';
import { getClassName, isClient } from '../utils/utils';

const LoginPage = () => {
    const { data: session } = useSession();

    const [shouldAnimateAstronaut, setShouldAnimateAstronaut] = useState(false);

    const onClickSignIn = async () => {
        setShouldAnimateAstronaut(true);
        await signIn('google', { redirect: true, callbackUrl: '/' });
    };

    useEffect(() => {
        // hack to fix animation on ios
        if (session === undefined) {
            setShouldAnimateAstronaut(false);
        }
    });

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
        <Image src="/astronaut.webp"
               alt="Astronaut"
               width={200} height={200}
               className={getClassName(
                   'login__astronaut',
                   shouldAnimateAstronaut && 'login__astronaut--animated'
               )}
               onMouseDown={event => event.stopPropagation()}
               onClick={onClickSignIn}
               priority
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
