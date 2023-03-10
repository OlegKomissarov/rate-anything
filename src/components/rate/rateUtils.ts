import { z } from 'zod';
import { validate } from '../../utils';

export interface Rate {
    subject: string;
    rate: number;
    username?: string | null;
}

export const rateSubjectSchema = z.string().min(1);

export const rateValueSchema = z.number().min(-10).max(10);

export const averageRateListSchema = z.array(z.object({
    subject: rateSubjectSchema,
    rate: rateValueSchema
}));

export const rateListSchema = z.array(z.object({
    subject: rateSubjectSchema,
    rate: rateValueSchema,
    username: z.string(),
    id: z.number()
}));

export const getRatesOfSubject = (rates: Rate[], subject: string) => rates.filter(rate => rate.subject === subject);

export const validateRateSubject = (subject: unknown): subject is string => validate<string>(subject, rateSubjectSchema);

export const validateRateValue = (rate: unknown): rate is number => validate<number>(rate, rateValueSchema);

export const validateRateList = (rateList: unknown): rateList is Rate[] => validate<Rate[]>(rateList, rateListSchema);

export const validateAverageRateList = (rateList: unknown): rateList is Rate[] => validate<Rate[]>(rateList, averageRateListSchema);

export const checkIfSubjectExists = (averageRates: Rate[], subject: string) => {
    if (averageRates.find(rate => rate.subject === subject)) {
        return true;
    }
    alert('There is no such subject. Please provide an existing subject in the input above');
    return false;
};
