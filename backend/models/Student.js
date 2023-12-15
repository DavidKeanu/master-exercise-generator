const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Student = sequelize.define('Student', {
  student_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  matrikelnummer: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = Student;