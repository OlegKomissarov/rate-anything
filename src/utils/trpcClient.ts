import { httpBatchLink, TRPCClientError } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { type AppRouter } from '../api/routes/_app';
import superjson from 'superjson';
import { isClient } from './utils';

const getBaseUrl = () => {
    if (isClient) {
        return '';
    }
    return process.env.URL;
};

const shouldRetry = (error: unknown) =>
    !(error instanceof TRPCClientError) || error.data.code === 'INTERNAL_SERVER_ERROR';

const handleError = (error: unknown) => {
    if (isClient) {
        if (error instanceof TRPCClientError && error.data.zodError) {
            // todo: use this instead of 'zod-validation-error' lib. make this a common function maybe
            const fieldErrors = error.data.zodError.fieldErrors;
            const formErrors = error.data.zodError.formErrors;
            const fieldErrorsOutput = Object.keys(fieldErrors)
                .map(errorSubject => `${errorSubject}: ${fieldErrors[errorSubject]}`);
            const formErrorsOutput = Object.keys(formErrors)
                .map(errorSubject => `${errorSubject}: ${formErrors[errorSubject]}`);
            const errorsOutput = [...fieldErrorsOutput, ...formErrorsOutput].join('. ');
            alert(errorsOutput);
            console.log(errorsOutput);
        } else {
            alert(error);
            console.log(error);
        }
    }
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
