import { Client } from '@planetscale/database';
import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import superjson from 'superjson';

export const dbConnection = new Client({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}).connection();

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
    const { req, res } = opts;
    const session = await getServerSession(req, res, authOptions);
    return { session };
};

export const trpc = initTRPC
    .context<Awaited<ReturnType<typeof createTRPCContext>>>()
    .create({ transformer: superjson });

const requireAuth = trpc.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Please sign in to make this request' });
    }
    return next({ ctx: { session: { ...ctx.session, user: ctx.session.user } } });
});

export const publicProcedure = trpc.procedure;
export const protectedProcedure = trpc.procedure.use(requireAuth);
export const createTRPCRouter = trpc.router;
