const { DataTypes } = require('sequelize');
const sequelize = require("../config/sequelizeConfig");
const Fehlerdetail = require("./Fehlerdetail");

const Hilfsmaterial = sequelize.define('Hilfsmaterial', {
  hilfsmaterial_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  fehlerdetail_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Fehlerdetail,
      key: 'fehlerdetail_id'
    }
  },
  hilfstext: {
    type: DataTypes.STRING
  },

}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = Hilfsmaterial;