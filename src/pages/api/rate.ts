import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { validateRateSubject, validateRateValue } from '../../utils/validations';
import { dbConnection } from '../../utils/utils';

const getRateList = (maxSubjectLength?: number) => {
    const query = maxSubjectLength
        ? 'SELECT * from rates WHERE CHAR_LENGTH(subject) <= ?'
        : 'SELECT * from rates';
    return dbConnection.execute(query, [maxSubjectLength]);
};

const getAverageRateList = (maxSubjectLength?: number) => {
    const query = maxSubjectLength ? `
        SELECT subject, CAST(ROUND(AVG(rate), 2) as FLOAT)
        as rate FROM rates WHERE CHAR_LENGTH(subject) <= ? GROUP BY subject
    ` : 'SELECT subject, CAST(ROUND(AVG(rate), 2) as FLOAT) as rate FROM rates GROUP BY subject';
    return dbConnection.execute(query, [maxSubjectLength]);
};

const getRateByUseremailAndSubject = (useremail: string, subject: string) =>
    dbConnection.execute('SELECT 1 FROM rates WHERE useremail = ? AND subject = ?;', [useremail, subject]);

const createRate = (subject: string, rate: string, username: string, useremail: string) =>
    dbConnection.execute(
        'INSERT INTO rates (`subject`, `rate`, `username`, `useremail`) VALUES (?, ?, ?, ?);',
        [subject, rate, username, useremail]
    );

const removeRate = (subject: string) =>
    dbConnection.execute('DELETE FROM rates WHERE subject = ?;', [subject]);

const checkIfUserRatedSubject = async (useremail: string, subject: string) => {
    const rates = await getRateByUseremailAndSubject(useremail, subject);
    return !!rates.rows.length;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    try {
        if (req.method === 'GET') {
            let maxSubjectLength;
            if (req.query.maxSubjectLength && !isNaN(+req.query.maxSubjectLength) && +req.query.maxSubjectLength > 0) {
                maxSubjectLength = +req.query.maxSubjectLength;
            }
            const [rateListResult, averageRateListResult] = await Promise.all([
                getRateList(maxSubjectLength),
                getAverageRateList(maxSubjectLength)
            ]);
            res.status(200).json({ rateList: rateListResult.rows, averageRateList: averageRateListResult.rows });
        } else if (req.method === 'POST') {
            const { subject, rate } = req.body;
            if (!validateRateSubject(subject)) {
                res.status(403).json({ message: 'Validation of subject is failed.' });
            } else if (!validateRateValue(rate)) {
                res.status(403).json({ message: 'Validation of rate value is failed.' });
            } else if (!session?.user?.name || !session?.user?.email) {
                res.status(401).json({ message: 'Only signed in user can create rates.' });
            } else if (await checkIfUserRatedSubject(session.user.email, subject)) {
                res.status(409).json({ message: `You have already rated ${subject}.` });
            } else {
                await createRate(subject, rate, session.user.name, session.user.email);
                res.status(200).send('');
            }
        } else if (req.method === 'DELETE') {
            const { subject } = req.body;
            if (!validateRateSubject(subject)) {
                res.status(403).json({ message: 'Validation of subject is failed.' });
            } else if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_USER_EMAIL) {
                res.status(403).json({ message: 'Deleting rates denied for this user.' });
            } else {
                await removeRate(subject);
                res.status(200).send('');
            }
        } else {
            res.status(400).json({ message: 'Wrong api method.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
