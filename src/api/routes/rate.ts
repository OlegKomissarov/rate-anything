import { z } from 'zod';
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from '../api';
import { rateSubjectSchema, rateValueSchema, validateAverageRateList } from '../../utils/validations';
import { TRPCError } from '@trpc/server';

export const rateRouter = createTRPCRouter({
    getRateList: publicProcedure
        .query(async ({ ctx: { prisma } }) => {
            return await prisma.rate.findMany();
        }),
    getAverageRateList: publicProcedure
        .query(async ({ ctx: { prisma } }) => {
            const averageRateListData = await prisma.rate.groupBy({
                by: ['subject'],
                _avg: {
                    rate: true
                }
            });
            const averageRateList = averageRateListData.map(averageRateResult => ({
                subject: averageRateResult.subject,
                rate: averageRateResult._avg.rate
                    ? Math.round(averageRateResult._avg.rate * 100) / 100
                    : averageRateResult._avg.rate
            }));
            if (validateAverageRateList(averageRateList)) {
                return averageRateList;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Received invalid average rate list from the database'
            });
        }),
    createRate: protectedProcedure
        .input(z.object({ subject: rateSubjectSchema, rate: rateValueSchema }))
        .mutation(async ({ input: { subject, rate: rateValue }, ctx: { session, prisma } }) => {
            const existingRateData = await prisma.rate.findFirst({
                where: {
                    useremail: session.useremail,
                    subject: subject
                }
            });
            if (existingRateData) {
                throw new TRPCError({ code: 'FORBIDDEN', message: `You have already rated ${subject}.` });
            } else {
                const modifiedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
                return await prisma.rate.create({
                    data: {
                        subject: modifiedSubject,
                        rate: rateValue,
                        useremail: session.useremail,
                        username: session.username
                    }
                });
            }
        }),
    removeRatesBySubject: adminProcedure
        .input(z.object({ subject: rateSubjectSchema }))
        .mutation(async ({ input: { subject }, ctx: { prisma } }) => {
            return await prisma.rate.deleteMany({ where: { subject } });
        })
});
