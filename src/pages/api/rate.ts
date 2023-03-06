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

const getRateList = () =>
    connection.execute('SELECT subject, CAST(ROUND(AVG(rate), 2) as FLOAT) as rate FROM rates GROUP BY subject');

const createRate = (subject: string, rate: string) =>
    connection.execute(`INSERT INTO rates (\`subject\`, \`rate\`) VALUES (?, ?);`, [subject, rate]);

const removeRate = (subject: string, password: string) =>
    connection.execute(
        `DELETE FROM rates WHERE subject = ? AND EXISTS (SELECT 1 FROM passwords WHERE password = ?);`,
        [subject, password]
    );

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    try {
        if (req.method === 'GET') {
            const result = await getRateList();
            res.status(200).json(result);
        } else if (req.method === 'POST') {
            const { subject, rate } = req.body;
            await createRate(subject, rate);
            res.status(200).send('');
        } else if (req.method === 'DELETE') {
            // todo: use session here
            const { subject, password } = req.body;
            await removeRate(subject, password);
            res.status(200).send('');
        } else {
            res.status(400).send('');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
};
