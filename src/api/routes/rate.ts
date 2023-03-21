import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../api';
import { rateSubjectSchema, rateValueSchema, validateAverageRateList, validateRateList } from '../../utils/validations';
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
    // createRate: protectedProcedure
    //     .input(z.object({ subject: rateSubjectSchema, rate: rateValueSchema }))
    //     .mutation(async ({ input: { subject, rate } }) => {
    //
    //     })
    // create: protectedProcedure
    //     .input(
    //         z.object({
    //             id: z.string().optional(),
    //             text: z.string().min(1)
    //         })
    //     )
    //     .mutation(async ({ ctx: { session }, input }) => {
    //         const todo = await ctx.task.create({
    //             data: input
    //         });
    //         return todo;
    //     }),
    // update: protectedProcedure
    //     .input(
    //         z.object({
    //             id: z.string().uuid(),
    //             data: z.object({
    //                 completed: z.boolean().optional(),
    //                 text: z.string().min(1).optional()
    //             })
    //         })
    //     )
    //     .mutation(async ({ ctx: { session }, input }) => {
    //         const { id, data } = input;
    //         const todo = await ctx.task.update({
    //             where: { id },
    //             data
    //         });
    //         return todo;
    //     }),
    // delete: protectedProcedure
    //     .input(z.string().uuid())
    //     .mutation(async ({ ctx: { session }, input: id }) => {
    //         await ctx.task.delete({ where: { id } });
    //         return id;
    //     })
});
