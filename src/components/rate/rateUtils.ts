import { z } from 'zod';

export interface Rate {
    subject: string;
    rate: number;
}

export const rateListValidator = z.array(z.object({
    subject: z.string(),
    rate: z.number().min(-10).max(10)
}));

export const passwordValidator = z.string().regex(/^[a-zA-Z0-9_]+$/).min(4);

export const validateRateList = (rateList: unknown): rateList is Rate[] => {
    let isValid;
    try {
        isValid = !!(Array.isArray(rateList) && rateListValidator.parse(rateList));
    } catch (err) {
        console.log(err);
        isValid = false;
    }
    return isValid;
};

export const validatePassword = (password: unknown): password is string => {
    let isValid;
    try {
        isValid = !!(typeof password === 'string' && passwordValidator.parse(password));
    } catch (err) {
        if (err instanceof z.ZodError) {
            alert(`Incorrect data. Password should be min 4 symbols and contain only letters, numbers or low line. ${
                err.errors.reduce((string, error) => `${string}${error.code}. `, '')
            }`);
        } else {
            alert(`An error occurred while validating password: ${err}`,);
        }
        isValid = false;
    }
    return isValid;
};
