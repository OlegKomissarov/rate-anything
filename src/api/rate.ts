import api from '../api';

export const getRateList = () => {
    return api.call('SELECT subject, CAST(ROUND(AVG(rate), 2) as FLOAT) as rate FROM rates GROUP BY subject')
        .then(response => response?.rows || []);
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
