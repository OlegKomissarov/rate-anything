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
            const averageRateListResult = await prisma.rate.groupBy({
                by: ['subject'],
                _avg: {
                    rate: true
                }
            });
            const averageRateList = averageRateListResult.map(averageRateResult => ({
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
        .mutation(async ({ input: { subject, rate: rateValue }, ctx: { session, dbConnection } }) => {
            const existingRateData = await dbConnection.execute(
                'SELECT 1 FROM rate WHERE useremail = ? AND subject = ?;',
                [session.user.email, subject]
            );
            if (existingRateData.rows.length) {
                throw new TRPCError({ code: 'FORBIDDEN', message: `You have already rated ${subject}.` });
            } else {
                const modifiedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
                return await dbConnection.execute(
                    'INSERT INTO rate (`subject`, `rate`, `useremail`, `username`) VALUES (?, ?, ?, ?);',
                    [modifiedSubject, rateValue, session.user.email, session.user.name]
                );
            }
        }),
    removeRate: adminProcedure
        .input(z.object({ subject: rateSubjectSchema }))
        .mutation(async ({ input: { subject }, ctx: { dbConnection } }) =>
            await dbConnection.execute('DELETE FROM rate WHERE subject = ?;', [subject]))
});
