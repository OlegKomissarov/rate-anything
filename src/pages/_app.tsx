import React from 'react';
import '../styles/main.css';
import Header from '../components/layout/Header';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';

const darkThemePageNames = ['login'];

const App = (props: any) => {
    const { Component, pageProps: { session, ...pageProps } } = props;

    const router = useRouter();
    const theme = darkThemePageNames.some(pageName => router.pathname.includes(pageName)) ? 'dark' : 'light';

    return <SessionProvider session={session}>
        <div className={`app app--theme--${theme}`}>
            <Head>
                <title>Rate Anything</title>
            </Head>
            <Header theme={theme} />
            <Component {...pageProps} />
        </div>
    </SessionProvider>;
};

export default App;
