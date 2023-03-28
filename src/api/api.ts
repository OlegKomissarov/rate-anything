import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
    const { req, res } = opts;
    const session = await getServerSession(req, res, authOptions);
    return { session, prisma };
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
    if (!ctx.session?.user?.email || !ctx.session?.user?.name) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Please sign in to make this request' });
    }
    return next({
        ctx: {
            session: {
                ...ctx.session,
                user: ctx.session.user,
                useremail: ctx.session.user.email,
                username: ctx.session.user.name
            }
        }
    });
});

const requireAdmin = trpc.middleware(({ ctx, next }) => {
    if (!ctx.session?.user?.email || !ctx.session?.user?.name) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Please sign in to make this request' });
    }
    if (ctx.session.user.email !== process.env.NEXT_PUBLIC_ADMIN_USER_EMAIL) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Deleting rates is not allowed for this user.' });
    }
    return next({
        ctx: {
            session: {
                ...ctx.session,
                user: ctx.session.user,
                useremail: ctx.session.user.email,
                username: ctx.session.user.name
            }
        }
    });
});

export const publicProcedure = trpc.procedure;
export const protectedProcedure = publicProcedure.use(requireAuth);
export const adminProcedure = publicProcedure.use(requireAdmin);
export const createTRPCRouter = trpc.router;
