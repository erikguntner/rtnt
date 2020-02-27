import { Pool, Client } from 'pg';
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.CONN_STRING,
  ssl: true,
});

const query = (text, params) => pool.query(text, params);

export default query;
