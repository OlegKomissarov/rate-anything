import React from 'react';
import '../styles/main.css';
import Header from '../components/layout/Header';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

const App = (props: any) => {
    const { Component, pageProps: { session, ...pageProps } } = props;

    return <SessionProvider session={session}>
        <div className="app">
            <Head>
                <title>Rate Anything</title>
            </Head>
            <Header />
            <Component {...pageProps} />
        </div>
    </SessionProvider>;
};

export default App;
