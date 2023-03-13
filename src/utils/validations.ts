import {z} from "zod";
import {fromZodError} from "zod-validation-error";
import {Rate} from "./utils";

export const validate = <T>(value: unknown, schema: z.Schema): value is T => {
    try {
        schema.parse(value);
        return true;
    } catch (err) {
        console.log('Validation error occurred for the value: ', value, err instanceof z.ZodError ? fromZodError(err) : err);
        alert(err instanceof z.ZodError ? fromZodError(err) : err);
        return false;
    }
};

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

export const rateDataSchema = z.object({
    rateList: rateListSchema,
    averageRateList: averageRateListSchema
});

export const validateRateSubject = (subject: unknown): subject is string => validate<string>(subject, rateSubjectSchema);

export const validateRateValue = (rate: unknown): rate is string => validate<string>(rate, rateValueSchema);

export const validateRateData = (rateData: unknown): rateData is { rateList: Rate[], averageRateList: Rate[] } =>
    validate<{ rateList: Rate[], averageRateList: Rate[] }>(rateData, rateDataSchema);

export const checkIfSubjectExists = (averageRateList: Rate[], subject: string) => {
    if (averageRateList.find(averageRate => averageRate.subject === subject)) {
        return true;
    }
    alert('There is no such subject. Please provide an existing subject in the input above');
    return false;
};
