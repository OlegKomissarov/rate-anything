import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { AverageRate, isClient, Rate } from './utils';

export const validate = <T>(value: unknown, schema: z.Schema): value is T => {
    try {
        schema.parse(value);
        return true;
    } catch (err) {
        console.log('Validation error occurred for the value: ', value, err instanceof z.ZodError ? fromZodError(err) : err);
        if (isClient) {
            alert(err instanceof z.ZodError ? fromZodError(err) : err);
        }
        return false;
    }
};

export const rateSubjectSchema = z.string().min(1);
export const validateRateSubject = (subject: unknown): subject is string =>
    validate<string>(subject, rateSubjectSchema);

export const rateValueSchema = z.number().min(-10).max(10);
export const validateRateValue = (rate: unknown): rate is number =>
    validate<number>(rate, rateValueSchema);

export const rateListSchema = z.array(z.object({
    subject: rateSubjectSchema,
    rate: rateValueSchema,
    username: z.string(),
    id: z.number()
}));
export const validateRateList = (rateList: unknown): rateList is Rate[] =>
    validate<Rate[]>(rateList, rateListSchema);

export const averageRateListSchema = z.array(z.object({
    subject: rateSubjectSchema,
    rate: rateValueSchema
}));
export const validateAverageRateList = (averageRateList: unknown): averageRateList is AverageRate[] =>
    validate<AverageRate[]>(averageRateList, averageRateListSchema);
