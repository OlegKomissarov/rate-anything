import { rateRouter } from './rate';
import { createTRPCRouter } from '../api';

export const appRouter = createTRPCRouter({
    rate: rateRouter
});

export type AppRouter = typeof appRouter;
