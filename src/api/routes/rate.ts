import { z } from 'zod';
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from '../api';
import {
    rateSubjectSchema, rateValueSchema, validateAverageRateList, validateRateList
} from '../../utils/validations';
import { TRPCError } from '@trpc/server';

export const rateRouter = createTRPCRouter({
    getRateList: publicProcedure
        .query(async ({ ctx: { dbConnection } }) => {
            const rateListResult = await dbConnection.execute('SELECT * from rates');

            // todo: make this code as common function maybe, check examples
            if (validateRateList(rateListResult.rows)) {
                return rateListResult.rows;
            }
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Rate list is invalid' });
        }),
    getAverageRateList: publicProcedure
        .input(z.object({ maxRateSubjectLength: z.number().int().min(1).optional() }).optional())
        .query(async ({ ctx: { dbConnection }, input }) => {
            const query = input?.maxRateSubjectLength
                ? `SELECT subject, CAST(ROUND(AVG(rate), 2) as FLOAT)
                   as rate FROM rates WHERE CHAR_LENGTH(subject) <= ? GROUP BY subject`
                : 'SELECT subject, CAST(ROUND(AVG(rate), 2) as FLOAT) as rate FROM rates GROUP BY subject';
            const averageRateListResult = await dbConnection.execute(query, [input?.maxRateSubjectLength]);

            if (validateAverageRateList(averageRateListResult.rows)) {
                return averageRateListResult.rows;
            }
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Average rate list is invalid' });
        }),
    createRate: protectedProcedure
        .input(z.object({ subject: rateSubjectSchema, rate: rateValueSchema }))
        .mutation(async ({ input: { subject, rate: rateValue }, ctx: { session, dbConnection } }) => {
            const existingRateData = await dbConnection.execute(
                'SELECT 1 FROM rates WHERE useremail = ? AND subject = ?;',
                [session.user.email, subject]
            );
            if (existingRateData.rows.length) {
                throw new TRPCError({ code: 'FORBIDDEN', message: `You have already rated ${subject}.` });
            } else {
                const modifiedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
                return await dbConnection.execute(
                    'INSERT INTO rates (`subject`, `rate`, `username`, `useremail`) VALUES (?, ?, ?, ?);',
                    [modifiedSubject, rateValue, session.user.name, session.user.email]
                );
            }
        }),
    removeRate: adminProcedure
        .input(z.object({ subject: rateSubjectSchema }))
        .mutation(async ({ input: { subject }, ctx: { dbConnection } }) =>
            await dbConnection.execute('DELETE FROM rates WHERE subject = ?;', [subject]))
});
