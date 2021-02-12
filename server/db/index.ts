import { Pool } from 'pg';
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.PG_CONN_STRING,
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pool.connect((err, client, done) => {
  if (err) throw err
  console.log('connected');
})

const query = (text, params) => pool.query(text, params);

export default query;
