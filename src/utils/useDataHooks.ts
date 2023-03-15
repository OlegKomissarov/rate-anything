import { useState } from 'react';
import { Rate } from './utils';
import { validateRateData } from './validations';

const useData = <T>(requestUrl: string, validate: (data: T) => data is T) => {
    const [data, setData] = useState<T | null>(null);

    const getData = async (...options: ({ [key: string]: string | number | undefined })[]) => {
        let url = `/api/${requestUrl}`;
        options?.forEach((option, index) => {
            if (!option) {
                return;
            }
            if (!index) {
                url += '?';
            } else {
                url += '&';
            }
            url += `${option.key}=${option.value}`;
        });
        const response = await fetch(url, { method: 'GET' });
        const jsonResponse = await response.json();
        if (response.ok && jsonResponse && validate(jsonResponse)) {
            setData(jsonResponse);
            return jsonResponse;
        }
        alert(jsonResponse?.message || `Failed to get ${url}, code is ${response.status}`);
        console.log(response);
        return Promise.reject(jsonResponse);
    };

    return { data, getData };
};

export const useRateList = () => {
    const validate = (data: unknown): data is { rateList: Rate[], averageRateList: Rate[] } => validateRateData(data);
    const { data: rateData, getData: getRateList } = useData('rate', validate);

    return { averageRateList: rateData?.averageRateList || [], rateList: rateData?.rateList || [], getRateList };
};

