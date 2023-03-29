import { z } from 'zod';
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from '../api';
import { rateSubjectSchema, rateValueSchema } from '../../utils/validations';
import { TRPCError } from '@trpc/server';

export const rateRouter = createTRPCRouter({
    getRateList: publicProcedure
        .query(async ({ ctx: { prisma } }) => {
            return await prisma.rate.findMany();
        }),
    getAverageRateList: publicProcedure
        .query(async ({ ctx: { prisma } }) => {
            return await prisma.average_rate.findMany();
        }),
    createRate: protectedProcedure
        .input(z.object({ subject: rateSubjectSchema, rate: rateValueSchema }))
        .mutation(async ({ input: { subject, rate: rateValue }, ctx: { session, prisma } }) => {
            const existingRateData = await prisma.rate.findFirst({ where: { useremail: session.useremail, subject } });
            if (existingRateData) {
                throw new TRPCError({ code: 'FORBIDDEN', message: `You have already rated ${subject}.` });
            } else {
                const modifiedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
                const existingAverageRate = await prisma.average_rate.findFirst({ where: { subject } });
                let updateOrCreateAverageRate;
                if (existingAverageRate) {
                    const newAverageRate = Math.round(
                        (existingAverageRate.average_rate * existingAverageRate.rates_amount + rateValue)
                        / (existingAverageRate.rates_amount + 1)
                    * 100) / 100;
                    updateOrCreateAverageRate = prisma.average_rate.update({
                        where: { subject: modifiedSubject },
                        data: {
                            average_rate: newAverageRate,
                            rates_amount: {
                                increment: 1
                            }
                        }
                    });
                } else {
                    updateOrCreateAverageRate = prisma.average_rate.create({
                        data: {
                            subject: modifiedSubject,
                            average_rate: rateValue,
                            rates_amount: 1
                        }
                    });
                }
                const createRate = prisma.rate.create({
                    data: {
                        subject: modifiedSubject,
                        rate: rateValue,
                        useremail: session.useremail,
                        username: session.username
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
                prisma.average_rate.deleteMany({ where: { subject } })
            ]);
        })
});
