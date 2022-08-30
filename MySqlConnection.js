const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'hardik',
        database: 'task_1',
        requestTimeout: 600000,
        options: {
            enableArithAbort: true,
            idleTimeoutMillis: 600000
        }
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations'
    }

  });
module.exports = knex