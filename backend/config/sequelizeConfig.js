const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Creates a sequelize connection.
 * @type {Sequelize} connection parameters
 */
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  dialectOptions: {
    options: {
      encrypt: true,
      enableArithAbort: true
    }
  }
});

module.exports = sequelize;