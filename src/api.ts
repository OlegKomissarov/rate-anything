import { connect, Connection } from '@planetscale/database';

// TODO: add .env
//DATABASE_USERNAME=750sx7i23l18ezjfbu91
// DATABASE_HOST=eu-central.connect.psdb.cloud
// DATABASE_PASSWORD=pscale_pw_x5WFjzecW6lNm6FrPnpoSM3NjEX8Qq36FO9xfcG84fo
const config = {
    host: 'aws.connect.psdb.cloud',
    username: '750sx7i23l18ezjfbu91',
    password: 'pscale_pw_x5WFjzecW6lNm6FrPnpoSM3NjEX8Qq36FO9xfcG84fo'
//   host: process.env.DATABASE_HOST,
//   username: process.env.DATABASE_USERNAME,
//   password: process.env.DATABASE_PASSWORD
};

const call = (query: string, args?: any[], options?: {}) => {
    const connection: Connection = connect(config);
    return connection.execute(query, args, options)
        .catch(e => {
            console.log(e);
            return Promise.resolve();
        });
};

export default { call };
