const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');
const Student = require("./Student");

const Sitzung = sequelize.define('Sitzung', {
  sitzung_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'student_id'
    }
  },
  session_start: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = Sitzung;