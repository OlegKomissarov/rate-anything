import React from 'react';
import '../styles/main.css';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { trpc } from '../utils/trpcClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isClient } from '../utils/utils';
import { TRPCClientError } from '@trpc/client';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            onError: error => {
                if (isClient) {
                    alert(error);
                }
                console.log(error);
            },
            retry: (failureCount, error) =>
                !(error instanceof TRPCClientError && (
                    error.data.code === 'UNAUTHORIZED'
                    // || error.data.code === ''    // todo: add validation errors here, and check other error types
                ))
        }
    }
});

const App = (props: any) => {
    const { Component, pageProps: { session, ...pageProps } } = props;

    return <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
            <Head>
                <title>Rate Anything</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
            </Head>
            <div className="app">
                <Component {...pageProps} />
            </div>
        </SessionProvider>
    </QueryClientProvider>;
};

export default trpc.withTRPC(App);
