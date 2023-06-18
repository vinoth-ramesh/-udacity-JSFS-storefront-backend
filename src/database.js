"use strict";
/* eslint @typescript-eslint/no-var-requires: "off" */
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const pg_1 = require("pg");
require("dotenv").config();
const isTest = process.env.NODE_ENV === "test";
// Parse numeric values as floats instead of strings
pg_1.types.setTypeParser(1700, function (val) {
    return parseFloat(val);
});
const pool = new pg_1.Pool({
    database: isTest ? process.env.PG_DB_TEST : process.env.PG_DB,
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
});
const query = async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    !isTest &&
        console.log("executed query", { text, duration, rows: res.rowCount });
    return res;
};
exports.query = query;
