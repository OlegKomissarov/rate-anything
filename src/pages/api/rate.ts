import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@planetscale/database';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

const client = new Client({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
});

const connection = client.connection();

const getRateList = (maxSubjectLength?: number) => {
    const query = maxSubjectLength
        ? 'SELECT * from rates WHERE CHAR_LENGTH(subject) <= ?'
        : 'SELECT * from rates';
    return connection.execute(query, [maxSubjectLength]);
}

const getAverageRateList = (maxSubjectLength?: number) => {
    const query = maxSubjectLength ? `
        SELECT subject, CAST(ROUND(AVG(rate), 2) as FLOAT)
        as rate FROM rates WHERE CHAR_LENGTH(subject) <= ? GROUP BY subject
    ` : 'SELECT subject, CAST(ROUND(AVG(rate), 2) as FLOAT) as rate FROM rates GROUP BY subject';
    return connection.execute(query, [maxSubjectLength]);
}

const getRateByUseremailAndSubject = (useremail: string, subject: string) =>
    connection.execute('SELECT 1 FROM rates WHERE useremail = ? AND subject = ?;', [useremail, subject]);

const createRate = (subject: string, rate: string, username: string, useremail: string) =>
    connection.execute(
        'INSERT INTO rates (`subject`, `rate`, `username`, `useremail`) VALUES (?, ?, ?, ?);',
        [subject, rate, username, useremail]
    );

const removeRate = (subject: string) =>
    connection.execute('DELETE FROM rates WHERE subject = ?;', [subject]);

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
            if (!session?.user?.name || !session?.user?.email) {
                res.status(401).json({ message: 'Only signed in user can create rates.' });
            } else if (await checkIfUserRatedSubject(session.user.email, subject)) {
                res.status(409).json({ message: `You have already rated ${subject}.` });
            } else {
                await createRate(subject, rate, session.user.name, session.user.email);
                res.status(200).send('');
            }
        } else if (req.method === 'DELETE') {
            if (session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_USER_EMAIL) {
                const { subject } = req.body;
                await removeRate(subject);
                res.status(200).send('');
            } else {
                res.status(403).json({ message: 'Deleting rates denied for this user.' });
            }
        } else {
            res.status(400).json({ message: 'Wrong api method.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
