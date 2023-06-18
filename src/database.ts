/* eslint @typescript-eslint/no-var-requires: "off" */

import { Pool, types } from "pg";
require("dotenv").config();

const isTest = process.env.NODE_ENV === "test";

// Parse numeric values as floats instead of strings
types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});

const pool = new Pool({
  database: isTest ? process.env.PG_DB_TEST : process.env.PG_DB,
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

export const query = async (text: string, params?: unknown[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  !isTest &&
    console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
};
