# Storefront Backend Project

An API for a storefront application. This project is a part of the [Udacity Full Stack Nanodegree](https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd0044).

## Requirements

[REQUIREMENTS.md](REQUIREMENTS.md)

## Tech Stack

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Environment Variables

To run this project, rename the `.env.example` file to `.env` and
edit accordingly.

```
PG_HOST=127.0.0.1 # Postgres host
PG_DB=store_db # Postgres database
PG_DB_TEST=store_db_test # Postgres test database
PG_USER=store_db_user # Postgres user
PG_PASSWORD=store123 # Postgres database password
PG_PORT=5432 # Postgres port

BCRYPT_PASSWORD=all-is-well-in-the-world
SALT_ROUNDS=10
TOKEN_SECRET=have-this-token-very-safe # JWT

PORT=4000 # app port
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/vinoth-ramesh/-udacity-JSFS-storefront-backend.git
```

Go to the project directory

```bash
  cd storefront-backend
```

Install dependencies

```bash
  npm install
```

Setup database

```
  CREATE USER store_db_user WITH PASSWORD 'store123';

  CREATE DATABASE store_db;

  CREATE DATABASE store_db_test;

  GRANT ALL ON SCHEMA public TO store_db_user;

  \c store_db

  GRANT ALL PRIVILEGES ON DATABASE store_db TO store_db_user;

  GRANT ALL ON SCHEMA public TO store_db_user; 

  \c store_db_test

  GRANT ALL PRIVILEGES ON DATABASE store_db_test TO store_db_user;

  GRANT ALL ON SCHEMA public TO store_db_user; 
```

Run migrations

```bash
  npm run migrate-up
```

Start the server

```bash
  npm run watch
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```
