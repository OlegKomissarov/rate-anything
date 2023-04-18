import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/main.css';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { trpc } from '../utils/trpcClient';
import { Slide, ToastContainer } from 'react-toastify';
import SessionLoader from '../components/layout/SessionLoader';

const App = (props: any) => {
    const { Component, pageProps: { session, ...pageProps } } = props;

    return <SessionProvider session={session}>
        <Head>
            <title>Rate Anything</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
            <meta name="description" content="Web application that allows you to create ratings for any subject" />
            <meta property="og:title" content="Rate Anything" />
            <meta property="og:description" content="Web application that allows you to create ratings for any subject" />
            <meta property="og:image" content={`${process.env.URL}/link-preview.webp`} />
            <meta property="og:url" content={process.env.URL} />
            <meta property="og:type" content="website" />
        </Head>
        <div className="app">
            <Component {...pageProps} />
        </div>
        <ToastContainer transition={Slide}
                        hideProgressBar
                        position="top-left"
                        limit={3}
        />
        <SessionLoader />
    </SessionProvider>;
};

export default trpc.withTRPC(App);
