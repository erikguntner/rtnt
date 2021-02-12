import { Pool } from 'pg';
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.PG_CONN_STRING,
  ssl: { rejectUnauthorized: false },
});

const query = (text, params) => pool.query(text, params);

export default query;
