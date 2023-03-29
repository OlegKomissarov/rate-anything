import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/main.css';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { trpc } from '../utils/trpcClient';
import { Slide, ToastContainer } from 'react-toastify';
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
        <ToastContainer autoClose={false}
                        transition={Slide}
                        hideProgressBar
                        position="top-center"
                        limit={3}
        />
    </SessionProvider>;
};

export default trpc.withTRPC(App);
