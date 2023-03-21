import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../api/routes/_app';
import { createTRPCContext } from '../../../api/api';

export default createNextApiHandler({
    router: appRouter,
    createContext: createTRPCContext
});
