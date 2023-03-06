import { z } from 'zod';

export interface Rate {
    subject: string;
    rate: number;
}

export const rateSubjectSchema = z.string().min(1);

export const rateValueSchema = z.number().min(-10).max(10);

export const passwordSchema = z.string().regex(/^[a-zA-Z0-9_]+$/).min(4);

export const rateListSchema = z.array(z.object({
    subject: rateSubjectSchema,
    rate: rateValueSchema
}));
