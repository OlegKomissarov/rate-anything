import { ZodError } from 'zod';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-toastify';

export const isClient = typeof window !== 'undefined';

export const getClassName = (...classNames: Array<string | boolean | undefined>) => {
    let classNamesString = '';
    classNames.forEach(className => {
        if (className && typeof className === 'string') {
            if (classNamesString) {
                classNamesString += ` ${className}`;
            } else {
                classNamesString = className;
            }
        }
    });
    return classNamesString.trim();
};

export const showError = (error: unknown, validationFieldName?: string, validationValue?: unknown) => {
    let errorOutput = error + '';
    if (error instanceof TRPCClientError && error.data.code === 'BAD_REQUEST' && error.data.zodError) { // backend validation error
        errorOutput = `Validation error occurred for request ${error.data.path}. `;
        if (error.data.zodError.fieldErrors.length) {
            errorOutput += Object.keys(error.data.zodError.fieldErrors)
                .map(errorSubject => `${errorSubject}: ${error.data.zodError.fieldErrors[errorSubject]}`).join('; ');
            errorOutput += `.`;
        }
    } else if (error instanceof ZodError) { // frontend validation error
        errorOutput = `Validation error occurred`;
        if (validationFieldName !== undefined) {
            errorOutput += ` for the field "${validationFieldName}"`;
        }
        if (validationValue !== undefined) {
            errorOutput += ` for the value "${validationValue}"`;
        }
        errorOutput += `. `;
        errorOutput += error.issues.map(issue => issue.message).join('; ');
        errorOutput += `.`;
    } else if (error instanceof TRPCClientError && error.data.code === 'INTERNAL_SERVER_ERROR') {
        errorOutput = `Internal Server Error occurred for the request ${error.data.path}`;
    }
    if (isClient) {
        toast(errorOutput, { toastId: errorOutput });
    }
};

export interface Position {
    x: number;
    y: number;
}

export const getRandomDecimal = (min: number, max: number) => Math.random() * (max - min) + min;

export const getRandomInteger = (min: number, max: number) => Math.round(getRandomDecimal(min, max));

const colors = [
    '#FCFAFB', '#B08B93', '#B5AABA', '#DACFD7', '#785C84', '#D9D2DB', '#C7BECB', '#7F7D7E', '#897891', '#B5CFAC',
    '#A3BB9C', '#C7D1C4', '#8FB782', '#956C71', '#ECE1E3', '#F9F8F9', '#D6CEBB', '#B4BCC5', '#A99E85', '#FEFFF9'
];
export const getRandomTextColor = () => colors[getRandomInteger(0, colors.length - 1)];

const minNumber = -10;
const maxNumber = 10;
const minFontSize = 7;
const maxFontSize = 20;
export const getFontSizeByNumber = (number: number) =>
    minFontSize + (number - minNumber) / (maxNumber - minNumber) * (maxFontSize - minFontSize);
