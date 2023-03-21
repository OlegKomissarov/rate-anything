import { z } from 'zod';
import { createTRPCRouter, dbConnection, protectedProcedure, publicProcedure } from '../api';
import { validateRateList, validateAverageRateList } from '../../utils/validations';
import { TRPCError } from '@trpc/server';

const getRateList = () => {
    const query = 'SELECT * from rates';
    return dbConnection.execute(query);
};

const getAverageRateList = (maxRateSubjectLength?: number) => {
    const query = maxRateSubjectLength ? `
        SELECT subject, CAST(ROUND(AVG(rate), 2) as FLOAT)
        as rate FROM rates WHERE CHAR_LENGTH(subject) <= ? GROUP BY subject
    ` : 'SELECT subject, CAST(ROUND(AVG(rate), 2) as FLOAT) as rate FROM rates GROUP BY subject';
    return dbConnection.execute(query, [maxRateSubjectLength]);
};

export const rateRouter = createTRPCRouter({
    getRateList: publicProcedure
        .query(async () => {
            const rateListResult = await getRateList();
            // todo: make this code as common function maybe, check examples
            if (validateRateList(rateListResult.rows)) {
                return rateListResult.rows;
            }
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Rate list is invalid' });
        }),
    getAverageRateList: publicProcedure
        .input(z.object({ maxRateSubjectLength: z.number().int().min(1).optional() }).optional())
        .query(async ({ input }) => {
            const averageRateListResult = await getAverageRateList(input?.maxRateSubjectLength);
            if (validateAverageRateList(averageRateListResult.rows)) {
                return averageRateListResult.rows;
            }
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Average rate list is invalid' });
        }),
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
