import { httpBatchLink } from '@trpc/client';
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

export const trpc = createTRPCNext<AppRouter>({
    config: () => ({
        transformer: superjson,
        links: [
            httpBatchLink({
                url: `${getBaseUrl()}/api/trpc`
            })
        ]
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
