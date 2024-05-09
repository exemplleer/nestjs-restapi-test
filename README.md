# REST API - Event App

This repository contains the server-side application for management events

## Requirements

- Node.js v20.9.0 or higher
- PostgresSQL v16 or higher

## How to install

### 1. Database

Before you start, prepare the application database. The SQL code for creating the database can be found in [`install.sql`](./install.sql)

### 2. Environment

Rename the [`.env.example`](./.env.example) environment file to `.env` and update the variables

### 3. Install dependencies and running

```bash
$ npm install

# start in:
$ npm run start:dev # watch mode
$ npm run start # development
$ npm run start:prod # production mode
```

## Documentation

View swagger documentation is available at `/docs` route
