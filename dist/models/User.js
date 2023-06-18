"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../database");
const { BCRYPT_PASSWORD: pepper, SALT_ROUNDS: saltRounds } = process.env;
class UserStore {
    constructor() {
        this.index = async () => {
            try {
                const result = await (0, database_1.query)(`SELECT id, username, "firstName", "lastName" FROM users`);
                return result.rows;
            }
            catch (error) {
                throw new Error(`Unable to fetch users: ${error}`);
            }
        };
        this.show = async (id) => {
            try {
                const result = await (0, database_1.query)(`SELECT id, "firstName", "lastName" FROM users WHERE id=($1)`, [id]);
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to fetch user: ${error}`);
            }
        };
        this.create = async (user) => {
            const sql = `SELECT * FROM users WHERE username=($1)`;
            const result = await (0, database_1.query)(sql, [user.username]);
            if (result.rows.length) {
                throw new Error("Username already exists");
            }
            try {
                const password_digest = bcrypt_1.default.hashSync(user.password + pepper, Number(saltRounds));
                const sql = `INSERT INTO users ("firstName", "lastName", username, password_digest) 
        VALUES ($1, $2, $3, $4) RETURNING id, username, "firstName", "lastName"`;
                const result = await (0, database_1.query)(sql, [
                    user.firstName,
                    user.lastName,
                    user.username,
                    password_digest,
                ]);
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to create user: ${error}`);
            }
        };
        this.authenticate = async (username, password) => {
            try {
                const sql = `SELECT * FROM users WHERE username=($1)`;
                const result = await (0, database_1.query)(sql, [username]);
                if (result.rows.length) {
                    const user = result.rows[0];
                    if (bcrypt_1.default.compareSync(password + pepper, user.password_digest)) {
                        return user;
                    }
                }
                return null;
            }
            catch (error) {
                throw new Error(`Unable to authenticate user: ${error}`);
            }
        };
    }
}
exports.default = UserStore;
