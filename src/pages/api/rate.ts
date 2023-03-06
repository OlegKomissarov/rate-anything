import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@planetscale/database';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

// TODO: add .env
// DATABASE_USERNAME=750sx7i23l18ezjfbu91
// DATABASE_HOST=eu-central.connect.psdb.cloud
// DATABASE_PASSWORD=pscale_pw_x5WFjzecW6lNm6FrPnpoSM3NjEX8Qq36FO9xfcG84fo
const client = new Client({
    host: 'aws.connect.psdb.cloud',
    username: '750sx7i23l18ezjfbu91',
    password: 'pscale_pw_x5WFjzecW6lNm6FrPnpoSM3NjEX8Qq36FO9xfcG84fo'
    // host: process.env.DATABASE_HOST,
    // username: process.env.DATABASE_USERNAME,
    // password: process.env.DATABASE_PASSWORD
});

const connection = client.connection();

const getRateList = () => connection.execute('SELECT * from rates');

const getAverageRateList = () =>
    connection.execute('SELECT subject, CAST(ROUND(AVG(rate), 2) as FLOAT) as rate FROM rates GROUP BY subject');

const getRateByUsernameAndSubject = (username: string, subject: string) =>
    connection.execute(`SELECT 1 FROM rates WHERE username = ? AND subject = ?;`, [username, subject]);

const createRate = (subject: string, rate: string, userName: string) =>
    connection.execute('INSERT INTO rates (\`subject\`, \`rate\`, \`userName\`) VALUES (?, ?, ?);', [subject, rate, userName]);

const removeRate = (subject: string) =>
    connection.execute('DELETE FROM rates WHERE subject = ?;', [subject]);

const checkIfUserRatedSubject = async (username: string, subject: string) => {
    const rates = await getRateByUsernameAndSubject(username, subject);
    return !!rates.rows.length;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    try {
        if (req.method === 'GET') {
            const [rateListResult, averageRateListResult] = await Promise.all([getRateList(), getAverageRateList()]);
            res.status(200).json({ rateListResult, averageRateListResult });
        } else if (req.method === 'POST') {
            const { subject, rate } = req.body;
            if (!session?.user?.name) {
                res.status(403).json({ message: 'Only signed in user can create rates.' });
            } else if (await checkIfUserRatedSubject(session.user.name, subject)) {
                res.status(403).json({ message: `You have already rated ${subject}.` });
            } else {
                await createRate(subject, rate, session.user.name);
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
            res.status(400).send('');
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};
