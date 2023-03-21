import { httpBatchLink, TRPCClientError } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { type AppRouter } from '../api/routes/_app';
import superjson from 'superjson';
import { isClient } from './utils';

const getBaseUrl = () => {
    if (isClient) { // browser should use relative url
        return '';
    }
    return process.env.URL;
};

const shouldRetry = (error: unknown) =>
    !(error instanceof TRPCClientError && (
        error.data.code === 'UNAUTHORIZED'
        || error.data.code === 'FORBIDDEN'
        // || error.data.code === ''    // todo: add validation errors here, and check other error types
    ));

const handleError = (error: unknown) => {
    if (isClient) {
        alert(error);
    }
    console.log(error);
};

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
                    onError: handleError,
                    retry: (failureCount, error) => shouldRetry(error)
                },
                mutations: {
                    onError: handleError,
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
