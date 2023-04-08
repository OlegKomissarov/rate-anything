import React, { useState } from 'react';
import Image from 'next/image';
import Button from '../components/elements/Button';
import Header from '../components/layout/Header';
import { signIn } from 'next-auth/react';
import { getClassName } from '../utils/utils';

const LoginPage = () => {
    const [shouldAnimateAstronaut, setShouldAnimateAstronaut] = useState(false);

    const onClickSignIn = async () => {
        setShouldAnimateAstronaut(true);
        await signIn('google', { redirect: true, callbackUrl: '/' });
    };

    return <div className="login">
        <Header className="login__header" />
        <Button className="login__button pan-screen-child"
                onClick={onClickSignIn}
        >
            Sign In To Create Your Rate
        </Button>
        <Image src="/astronaut.webp"
               alt="Astronaut"
               width={200} height={200}
               className={getClassName(
                   'login__astronaut pan-screen-child',
                   shouldAnimateAstronaut && 'login__astronaut--animated'
               )}
               onClick={onClickSignIn}
               priority
        />
    </div>;
};

export default LoginPage;
