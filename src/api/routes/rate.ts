import { z } from 'zod';
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from '../api';
import { rateSubjectSchema, rateValueSchema } from '../../utils/validations';
import { TRPCError } from '@trpc/server';

export const rateRouter = createTRPCRouter({
    getAverageRateList: publicProcedure
        .input(z.object({
            limit: z.number().min(1).max(1000).nullish(),
            cursor: z.string().nullish(),
            includePlainRates: z.boolean().optional(),
            sorting: z.object({ field: z.string(), order: z.string() }).optional(),
            searching: z.object({ field: z.string(), value: z.string() }).optional()
        }))
        .query(async ({ input, ctx: { prisma } }) => {
            const { cursor, limit: inputLimit, includePlainRates, sorting, searching } = input;
            const limit = inputLimit ?? 100;
            let nextCursor: typeof cursor | undefined = undefined;
            const averageRateList = await prisma.averageRate.findMany({
                cursor: cursor ? { subject: cursor } : undefined,
                take: limit + 1,
                orderBy: sorting ? { [sorting.field]: sorting.order } : { subject: 'asc' },
                where: searching?.value ? { [searching.field]: { contains: searching.value } } : undefined,
                include: { rates: includePlainRates }
            });
            if (averageRateList.length > limit) {
                const nextItem = averageRateList.pop();
                nextCursor = nextItem!.subject;
            }
            return {
                nextCursor,
                data: averageRateList
            };
        }),
    createRate: protectedProcedure
        .input(z.object({ subject: rateSubjectSchema, rate: rateValueSchema }))
        .mutation(async ({ input: { subject, rate: rateValue }, ctx: { session, prisma } }) => {
            const existingRateData = await prisma.rate.findFirst({ where: { userEmail: session.userEmail, subject } });
            if (existingRateData) {
                throw new TRPCError({ code: 'FORBIDDEN', message: `You have already rated ${subject}.` });
            } else {
                const trimmedSubject = subject.trim();
                const modifiedSubject = trimmedSubject.charAt(0).toUpperCase() + trimmedSubject.slice(1).toLowerCase();
                const existingAverageRate = await prisma.averageRate.findFirst({ where: { subject } });
                let updateOrCreateAverageRate;
                if (existingAverageRate) {
                    const newAverageRate = Math.round(
                        (existingAverageRate.averageRate * existingAverageRate.ratesAmount + rateValue)
                        / (existingAverageRate.ratesAmount + 1)
                    * 100) / 100;
                    updateOrCreateAverageRate = prisma.averageRate.update({
                        where: { subject: modifiedSubject },
                        data: {
                            averageRate: newAverageRate,
                            ratesAmount: {
                                increment: 1
                            }
                        }
                    });
                } else {
                    updateOrCreateAverageRate = prisma.averageRate.create({
                        data: {
                            subject: modifiedSubject,
                            averageRate: rateValue,
                            ratesAmount: 1
                        }
                    });
                }
                const createRate = prisma.rate.create({
                    data: {
                        subject: modifiedSubject,
                        rate: rateValue,
                        userEmail: session.userEmail,
                        userName: session.userName
                    }
                });
                return await Promise.all([createRate, updateOrCreateAverageRate]);
            }
        }),
    removeRatesBySubject: adminProcedure
        .input(z.object({ subject: rateSubjectSchema }))
        .mutation(async ({ input: { subject }, ctx: { prisma } }) => {
            return await Promise.all([
                prisma.rate.deleteMany({ where: { subject } }),
                prisma.averageRate.deleteMany({ where: { subject } })
            ]);
        })
});
