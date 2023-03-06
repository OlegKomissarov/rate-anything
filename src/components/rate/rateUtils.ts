import { z } from 'zod';

export interface Rate {
    subject: string;
    rate: number;
    username?: string | null;
}

export const rateSubjectSchema = z.string().min(1);

export const rateValueSchema = z.number().min(-10).max(10);
