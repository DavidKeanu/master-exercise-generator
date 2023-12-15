const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Fehlerklasse = sequelize.define('Fehlerklasse', {
  fehlerklasse_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = Fehlerklasse;