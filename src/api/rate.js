import api from '../api';

export const getRateList = () => {
    return api.call('SELECT subject, CAST(ROUND(AVG(rate), 2) as FLOAT) as rate FROM rates GROUP BY subject')
        .then(response => response.rows);
};
