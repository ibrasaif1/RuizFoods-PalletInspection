# Setting Up the .env File for Local Development

To connect to the database and run the server locally, you'll need to set up a `.env` file in the root of the project with the necessary environment variables. This is to connect to the database but I keep this off the repo for safety reasons so no one unauthorized has the credentials to access the database.

## Steps:

1. Create a file in the root of the project named `.env`.

2. Add the following line to the `.env` file, replacing `username`, `password`, `host`, `port`, and `database` with our actual database connection details:

DATABASE_URL=postgresql://username:password@host:port/database

This is your PostgreSQL connection string, which the application uses to connect to the database.

3. Save the `.env` file.

The `dotenv` package, already included in the project, will automatically load these environment variables, allowing the application to access your database securely.

**Important**: The `.env` file contains sensitive information and should not be committed to Git. It is already listed in `.gitignore` to prevent it from being accidentally included in version control.

# Running the project

Open the code locally and run `node server.js` for the project to start running locally. To do this you'll need to download and install Node which you can do at https://nodejs.org/en/download/
