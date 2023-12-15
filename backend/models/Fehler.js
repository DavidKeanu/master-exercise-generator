const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');
const Fehlerdetail = require("./Fehlerdetail");
const Sitzung = require("./Sitzung");

const Fehler = sequelize.define('Fehler', {
  fehler_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fehlerdetail_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Fehlerdetail,
      key: 'fehlerdetail_id'
    }
  },
  zeitpunkt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  sitzung_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Sitzung,
      key: 'sitzung_id'
    }
  }
}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = Fehler;