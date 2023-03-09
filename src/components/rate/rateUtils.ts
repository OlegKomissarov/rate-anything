import { z } from 'zod';

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
