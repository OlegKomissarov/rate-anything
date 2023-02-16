import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

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

export const validate = <T>(value: unknown, schema: z.Schema, withAlert = true): value is T => {
    try {
        schema.parse(value);
        return true;
    } catch (err) {
        if (withAlert) {
            alert(err instanceof z.ZodError ? fromZodError(err) : err);
        } else {
            console.log(err instanceof z.ZodError ? fromZodError(err) : err);
        }
        return false;
    }
};
