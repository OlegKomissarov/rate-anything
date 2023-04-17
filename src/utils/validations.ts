import { z } from 'zod';
import { maxRateValue, minRateValue, showError } from './utils';

type ValidateOptions = {
    showError?: boolean
}

export const validate = <T>(schema: z.Schema, fieldName: string, value: unknown, options?: ValidateOptions): value is T => {
    try {
        schema.parse(value);
        return true;
    } catch (error) {
        if (options?.showError) {
            showError(error, fieldName, value);
        }
        return false;
    }
};

export const rateSubjectSchema = z.string().min(1);
export const validateRateSubject = (subject: unknown, options?: ValidateOptions): subject is string =>
    validate<string>(rateSubjectSchema, 'rate subject', subject, options);

export const rateValueSchema = z.number().min(minRateValue).max(maxRateValue);
export const validateRateValue = (rate: unknown, options?: ValidateOptions): rate is number =>
    validate<number>(rateValueSchema, 'rate value', rate, options);
