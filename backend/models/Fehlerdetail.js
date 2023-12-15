const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');
const Fehlerklasse = require("./Fehlerklasse");

const Fehlerdetail = sequelize.define('Fehlerdetail', {
  fehlerdetail_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  fehlerklasse_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Fehlerklasse,
      key: 'fehlerklasse_id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  detail: {
    type: DataTypes.STRING
  }
}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = Fehlerdetail;