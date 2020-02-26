import { Pool, Client } from 'pg';

const pool = new Pool({
  connectionString: process.env.CONN_STRING,
});

const query = (text, params) => pool.query(text, params);

export default query;
