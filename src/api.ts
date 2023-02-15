import { connect, Connection } from '@planetscale/database';

const config = {
    host: 'aws.connect.psdb.cloud',
    username: '750sx7i23l18ezjfbu91',
    password: 'pscale_pw_x5WFjzecW6lNm6FrPnpoSM3NjEX8Qq36FO9xfcG84fo'
    // host: process.env.DATABASE_HOST,
    // username: process.env.DATABASE_USERNAME,
    // password: process.env.DATABASE_PASSWORD
};
//DATABASE_USERNAME=750sx7i23l18ezjfbu91
// DATABASE_HOST=eu-central.connect.psdb.cloud
// DATABASE_PASSWORD=pscale_pw_x5WFjzecW6lNm6FrPnpoSM3NjEX8Qq36FO9xfcG84fo

// import { connect } from '@planetscale/database'
// const config = {
//   host: process.env.DATABASE_HOST,
//   username: process.env.DATABASE_USERNAME,
//   password: process.env.DATABASE_PASSWORD
// }
// const conn = connect(config)
// const results = await conn.execute('select 1 from dual where 1=?', [1])

const call = (query: string, args?: any[], options?: object) => {
    const connection: Connection = connect(config);
    return connection.execute(query, args, options)
        .catch(e => {
            console.log(e);
            return Promise.resolve();
        });
};

export default { call };
