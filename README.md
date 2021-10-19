# We Love Movies

Express server designed to power a movie website for films available in theaters.

## Prerequisites

- Designed to work with a cloud-based postgres db.

## Setup

1. `npm install` in root directory of repo.

1. Create a `.env` file and assign your db's full url to a `DATABASE_URL` variable.

1. `npm run migrate` will populate the db with necessary tables.

1. `npm run seed` will fill tables with test data.

1. You can always run `npm run reset` to rollback migrations, recreate tables and seed data again.

1. `npm run start` will run the server locally.
