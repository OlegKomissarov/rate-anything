import React, { useState } from 'react';
import Image from 'next/image';
import Button from '../components/elements/Button';
import Header from '../components/layout/Header';
import { signIn, useSession } from 'next-auth/react';
import { getClassName } from '../utils/utils';
import { useRouter } from 'next/router';
import StarsBackground from '../components/layout/StarsBackground';

const LoginPage = () => {
    const router = useRouter();
    const { status: sessionStatus } = useSession();

    const [shouldAnimateAstronaut, setShouldAnimateAstronaut] = useState(false);

    const onClickSignIn = async () => {
        setShouldAnimateAstronaut(true);
        await signIn('google', { redirect: true, callbackUrl: '/' });
    };

    const authDisabled = sessionStatus !== 'unauthenticated';

    if (sessionStatus === 'authenticated') {
        router.push('/');
    }

    return <>
        <StarsBackground />
        <main className="login">
            <Header className="login__header" />
            <Button className="login__button pan-screen-child"
                    onClick={onClickSignIn}
                    disabled={authDisabled}
            >
                Sign In To Create Your Rate
            </Button>
            <Image src="/astronaut.webp"
                   alt="Astronaut"
                   width={200} height={200}
                   className={getClassName(
                       'login__astronaut pan-screen-child',
                       shouldAnimateAstronaut && 'login__astronaut--animated',
                       authDisabled && 'disabled'
                   )}
                   onClick={onClickSignIn}
                   priority
            />
        </main>
    </>;
};

export default LoginPage;
