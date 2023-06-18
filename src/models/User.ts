import bcrypt from "bcrypt";

import { query } from "../database";

export type User = {
  firstName: string;
  lastName: string;
  username: string;
};

export type UserWithId = User & {
  id: number;
};

export type UserWithPassword = User & {
  password: string;
};

const { BCRYPT_PASSWORD: pepper, SALT_ROUNDS: saltRounds } = process.env;

export default class UserStore {
  index = async (): Promise<UserWithId[]> => {
    try {
      const result = await query(
        `SELECT id, username, "firstName", "lastName" FROM users`
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to fetch users: ${error}`);
    }
  };

  show = async (id: number): Promise<UserWithId> => {
    try {
      const result = await query(
        `SELECT id, "firstName", "lastName" FROM users WHERE id=($1)`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to fetch user: ${error}`);
    }
  };

  create = async (user: UserWithPassword): Promise<UserWithId> => {
    const sql = `SELECT * FROM users WHERE username=($1)`;
    const result = await query(sql, [user.username]);
    if (result.rows.length) {
      throw new Error("Username already exists");
    }

    try {
      const password_digest = bcrypt.hashSync(
        user.password + (pepper as string),
        Number(saltRounds)
      );

      const sql = `INSERT INTO users ("firstName", "lastName", username, password_digest) 
        VALUES ($1, $2, $3, $4) RETURNING id, username, "firstName", "lastName"`;

      const result = await query(sql, [
        user.firstName,
        user.lastName,
        user.username,
        password_digest,
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create user: ${error}`);
    }
  };

  authenticate = async (
    username: string,
    password: string
  ): Promise<UserWithId | null> => {
    try {
      const sql = `SELECT * FROM users WHERE username=($1)`;
      const result = await query(sql, [username]);

      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + pepper, user.password_digest)) {
          return user;
        }
      }

      return null;
    } catch (error) {
      throw new Error(`Unable to authenticate user: ${error}`);
    }
  };
}
