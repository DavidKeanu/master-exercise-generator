# Backend for S.E.E.D (Smart Editor Empowering Development)

## Setup before installation
For the backend to run, a database compatible with [sequelize](https://sequelize.org/), a [rapidapi judge0](https://rapidapi.com/judge0-official/api/judge0-ce) key and an [openai](https://openai.com/) api key is needed.

- Visit https://rapidapi.com/judge0-official/api/judge0-ce, register and subscribe the judge0 api for free. After this you will
get the needed `url`, `key` and `host`.

- Visit https://openai.com/blog/openai-api and register for an api key. This is **paid**.
Read the [pricing](https://openai.com/pricing) for more. For testing you will probably pay nearly nothing.

- Setup a database which is compatible with the ORM Tool Sequelize. [List of supported databases](https://sequelize.org/docs/v6/getting-started/)

## Installation
1. Install the needed dependencies with `npm install`.
2. Add a `.env` file with the content of the provided `.env.sample` file and provide the needed information.
3. Install the needed [database driver](https://sequelize.org/docs/v6/getting-started/) for your database. E.g. `npm install --save tedious`
4. Run `npm run setup-db` once to set up all tables 
5. Run `npm run start` to start the application

## Configure the frontend correctly
The git-repo and installation guide for the frontend can be found [here](TODO)

## Start the application
`npm start`