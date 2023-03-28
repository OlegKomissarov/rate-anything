import { Client } from '@planetscale/database';
import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { PrismaClient } from '@prisma/client';

const dbConnection = new Client({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}).connection();

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
    const { req, res } = opts;
    const session = await getServerSession(req, res, authOptions);
    return { session, dbConnection };
};

export const trpc = initTRPC
    .context<Awaited<ReturnType<typeof createTRPCContext>>>()
    .create({
        transformer: superjson,
        errorFormatter({ shape, error }) {
            return {
                ...shape,
                data: {
                    ...shape.data,
                    zodError:
                        error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
                            ? error.cause.flatten()
                            : null
                }
            };
        }
    });

const requireAuth = trpc.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Please sign in to make this request' });
    }
    return next({ ctx: { session: { ...ctx.session, user: ctx.session.user } } });
});

const requireAdmin = trpc.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Please sign in to make this request' });
    }
    if (ctx.session.user.email !== process.env.NEXT_PUBLIC_ADMIN_USER_EMAIL) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Deleting rates is not allowed for this user.' });
    }
    return next({ ctx: { session: { ...ctx.session } } });
});

export const publicProcedure = trpc.procedure;
export const protectedProcedure = trpc.procedure.use(requireAuth);
export const adminProcedure = trpc.procedure.use(requireAdmin);
export const createTRPCRouter = trpc.router;

export const prisma = new PrismaClient();
