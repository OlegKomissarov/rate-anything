import api from '../api';
import { z } from 'zod';

const rateListValidator = z.array(z.object({
    subject: z.string(),
    rate: z.number().min(-10).max(10)
}));

export const getRateList = () => {
    return api.call('SELECT subject, CAST(ROUND(AVG(rate), 2) as FLOAT) as rate FROM rates GROUP BY subject')
        .then(response => rateListValidator.parse(response?.rows));
};

export const createRate = (subject: string, rate: string) => {
    return api.call(`INSERT INTO rates (\`subject\`, \`rate\`) VALUES (?, ?);`, [subject, rate]);
};

export const removeRate = (subject: string, password: string) => {
    return api.call(
        `DELETE FROM rates WHERE subject = ? AND EXISTS (SELECT 1 FROM passwords WHERE password = ?);`,
        [subject, password]
    );
};
