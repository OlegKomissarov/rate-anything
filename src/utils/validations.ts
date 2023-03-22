import { z } from 'zod';
import { AverageRate, Rate, showError } from './utils';

export const validate = <T>(schema: z.Schema, fieldName: string, value: unknown): value is T => {
    try {
        schema.parse(value);
        return true;
    } catch (error) {
        showError(error, fieldName, value);
        return false;
    }
};

export const rateSubjectSchema = z.string().min(1);
export const validateRateSubject = (subject: unknown): subject is string =>
    validate<string>(rateSubjectSchema, 'rate subject', subject);

export const rateValueSchema = z.number().min(-10).max(10);
export const validateRateValue = (rate: unknown): rate is number =>
    validate<number>(rateValueSchema, 'rate value', rate);

export const rateListSchema = z.array(z.object({
    subject: rateSubjectSchema,
    rate: rateValueSchema,
    useremail: z.string(),
    username: z.string(),
    id: z.number()
}));
export const validateRateList = (rateList: unknown): rateList is Rate[] =>
    validate<Rate[]>(rateListSchema, 'rate list', rateList);

export const averageRateListSchema = z.array(z.object({
    subject: rateSubjectSchema,
    rate: rateValueSchema
}));
export const validateAverageRateList = (averageRateList: unknown): averageRateList is AverageRate[] =>
    validate<AverageRate[]>(averageRateListSchema, 'average rate list', averageRateList);
