import { httpBatchLink, TRPCClientError } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { type AppRouter } from '../api/routes/_app';
import superjson from 'superjson';
import { isClient, showError } from './utils';

const getBaseUrl = () => {
    if (isClient) {
        return '';
    }
    return process.env.URL;
};

const shouldRetry = (error: unknown) =>
    !(error instanceof TRPCClientError) || error.data.code === 'INTERNAL_SERVER_ERROR';

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
                    retry: (failureCount, error) => shouldRetry(error)
                },
                mutations: {
                    onError: error => showError(error),
                    retry: (failureCount, error) => shouldRetry(error)
                }
            }
        }
    })
});

// todo: remove comments after implementing create rate endpoint
/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
