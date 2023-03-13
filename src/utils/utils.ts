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

export const getRandomDecimal = (min: number, max: number) => Math.random() * (max - min) + min;

export const getRandomInteger = (min: number, max: number) => Math.round(getRandomDecimal(min, max));

export interface Position {
    x: number;
    y: number;
}

const colors = [
    '#FCFAFB', '#B08B93', '#B5AABA', '#DACFD7', '#785C84', '#D9D2DB', '#C7BECB', '#7F7D7E', '#897891', '#B5CFAC',
    '#A3BB9C', '#C7D1C4', '#8FB782', '#956C71', '#ECE1E3', '#F9F8F9', '#D6CEBB', '#B4BCC5', '#A99E85', '#FEFFF9'
];
export const getRandomTextColor = () => {
    return colors[getRandomInteger(0, colors.length - 1)];
};

export interface Rate {
    subject: string;
    rate: number;
    username?: string | null;
}

const minRate = -10;
const maxRate = 10;
const minFontSize = 7;
const maxFontSize = 20;
export const getFontSizeByRate = (rate: number) =>
    minFontSize + (rate - minRate) / (maxRate - minRate) * (maxFontSize - minFontSize);

export const getRatesOfSubject = (rateList: Rate[], subject: string) => rateList.filter(rate => rate.subject === subject);
