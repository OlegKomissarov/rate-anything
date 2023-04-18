import { z } from 'zod';
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from '../api';
import { rateSubjectSchema, rateValueSchema } from '../../utils/validations';
import { TRPCError } from '@trpc/server';

const modifySubject = (subject: string) => {
    const trimmedSubject = subject.trim();
    return trimmedSubject.charAt(0).toUpperCase() + trimmedSubject.slice(1).toLowerCase();
};

export const rateRouter = createTRPCRouter({
    getAverageRateList: publicProcedure
        .input(z.object({
            limit: z.number().min(1).max(1000).nullish(),
            cursor: z.string().nullish(),
            includePlainRates: z.boolean().optional(),
            sorting: z.object({ field: z.string(), order: z.string() }).optional(),
            searching: z.object({ field: z.string(), value: z.string() }).optional(),
            filterExcludingUserEmail: z.string().optional()
        }))
        .query(async ({ input, ctx: { prisma } }) => {
            const {
                cursor, limit: inputLimit, includePlainRates, sorting, searching, filterExcludingUserEmail
            } = input;
            const limit = inputLimit ?? 100;
            let nextCursor: typeof cursor | undefined = undefined;
            const where: any = {};
            if (searching?.value) {
                where[searching.field] = { contains: searching.value };
            }
            if (filterExcludingUserEmail) {
                where.rates = {
                    none: {
                        userEmail: filterExcludingUserEmail
                    }
                };
            }
            const averageRateList = await prisma.averageRate.findMany({
                cursor: cursor ? { subject: cursor } : undefined,
                take: limit + 1,
                orderBy: sorting ? { [sorting.field]: sorting.order } : { subject: 'asc' },
                where,
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
            const modifiedSubject = modifySubject(subject);
            const existingRateData = await prisma.rate.findFirst({
                where: { userEmail: session.userEmail, subject: modifiedSubject }
            });
            if (existingRateData) {
                throw new TRPCError({ code: 'FORBIDDEN', message: `You have already rated ${modifiedSubject}.` });
            } else {
                const existingAverageRate = await prisma.averageRate.findFirst({ where: { subject: modifiedSubject } });
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
                const [rate, averageRate] = await Promise.all([createRate, updateOrCreateAverageRate]);
                return { rate, averageRate };
            }
        }),
    removeRatesBySubject: adminProcedure
        .input(z.object({ subject: rateSubjectSchema }))
        .mutation(async ({ input: { subject }, ctx: { prisma } }) => {
            const modifiedSubject = modifySubject(subject);
            return await Promise.all([
                prisma.rate.deleteMany({ where: { subject: modifiedSubject } }),
                prisma.averageRate.deleteMany({ where: { subject: modifiedSubject } })
            ]);
        })
});
