import { getRandomInteger } from './utils';
import { useRef } from 'react';

const colors = ['#FCFAFB', '#B08B93', '#B5AABA', '#DACFD7', '#785C84', '#D9D2DB', '#C7BECB', '#7F7D7E', '#897891',
    '#B5CFAC', '#A3BB9C', '#C7D1C4', '#8FB782', '#956C71', '#ECE1E3', '#F9F8F9', '#D6CEBB', '#B4BCC5', '#A99E85',
    '#FEFFF9'];

const getRandomTextColor = () => {
    return colors[getRandomInteger(0, colors.length - 1)];
};

const minRate = -10;
const maxRate = 10;
const minFontSize = 7;
const maxFontSize = 20;
const getFontSizeByRate = (rate: number) =>
    minFontSize + (rate - minRate) / (maxRate - minRate) * (maxFontSize - minFontSize);

export default (rateValue: number) => {
    const color = useRef<string>(getRandomTextColor());
    const fontSize = useRef<number>(getFontSizeByRate(rateValue));

    return { color: color.current, fontSize: fontSize.current };
};
