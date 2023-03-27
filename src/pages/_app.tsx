import React from 'react';
import '../styles/main.css';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { trpc } from '../utils/trpcClient';
import StarsBackground from '../components/layout/StarsBackground';

const App = (props: any) => {
    const { Component, pageProps: { session, ...pageProps } } = props;

    return <SessionProvider session={session}>
        <Head>
            <title>Rate Anything</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
        </Head>
        <div className="app">
            <Component {...pageProps} />
            <StarsBackground />
        </div>
    </SessionProvider>;
};

export default trpc.withTRPC(App);
