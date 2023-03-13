import React from 'react';
import '../styles/main.css';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

const App = (props: any) => {
    const { Component, pageProps: { session, ...pageProps } } = props;

    return <SessionProvider session={session}>
        <Head>
            <title>Rate Anything</title>
        </Head>
        <div className="app">
            <Component {...pageProps} />
        </div>
    </SessionProvider>;
};

export default App;
