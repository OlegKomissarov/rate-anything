import { httpBatchLink, TRPCClientError } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type AppRouter } from '../api/routes/_app';
import superjson from 'superjson';
import { isClient, showError } from './utils';

const getBaseUrl = () => {
    if (isClient) {
        return '';
    }
    return process.env.URL;
};

const shouldRetry = (failureCount: number, error: unknown) =>
    failureCount < 2 && (!(error instanceof TRPCClientError) || error.data?.code === 'INTERNAL_SERVER_ERROR');

export const trpc = createTRPCNext<AppRouter>({
    config: () => ({
        transformer: superjson,
        links: [
            httpBatchLink({
                url: `${getBaseUrl()}/api/trpc`
            })
        ],
        queryClientConfig: {
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false,
                    onError: error => showError(error),
                    retry: shouldRetry
                },
                mutations: {
                    onError: error => showError(error),
                    retry: shouldRetry
                }
            }
        }
    })
});
