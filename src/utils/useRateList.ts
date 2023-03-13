import {maxSubjectLengthForLoginBackground} from "./loginUtils";
import {Rate, validateAverageRateList, validateRateList} from "./rateUtils";
import {useState} from "react";

export default (maxSubjectLength?: number) => {
    const [rateList, setRateList] = useState<Rate[]>([]);
    const [averageRateList, setAverageRateList] = useState<Rate[]>([]);

    const getRateList = async () => {
        let url = '/api/rate';
        if (maxSubjectLength) {
            url += `?maxSubjectLength=${maxSubjectLengthForLoginBackground}`;
        }
        const response = await fetch(url, { method: 'GET' });
        const result = await response.json();
        if (response.ok && result && validateRateList(result.rateList) && validateAverageRateList(result.averageRateList)) {
            setRateList(result.rateList);
            setAverageRateList(result.averageRateList);
            return result;
        }
        alert(result?.message || `Failed to get rate list, code is ${response.status}`);
        return Promise.reject(result);
    };

    return { averageRateList, rateList, getRateList };
};
