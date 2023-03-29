import { z } from 'zod';
import { showError } from './utils';

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

