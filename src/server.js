'use strict';
require('dotenv').config();

const app = require('./app');
const knex = require('knex')
const { PORT, DB_URL } = require('./config');
const NODE_ENV = process.env.NODE_ENV;

const db = knex({
  client: 'pg',
  connection: DB_URL
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(
    `Server listening in ${NODE_ENV} at http://localhost:${PORT}....db url is ${DB_URL} `
  );
});
