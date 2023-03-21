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

export interface Rate {
    subject: string;
    rate: number;
    username: string;
    id: number;
}

export interface AverageRate {
    subject: string;
    rate: number;
}

export const getRatesOfSubject = (rateList: Rate[], subject: string) =>
    rateList.filter(rate => rate.subject === subject);
