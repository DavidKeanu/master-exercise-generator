const {DataTypes} = require("sequelize");
const Hilfsmaterial = require("./Hilfsmaterial");
const sequelize = require("../config/sequelizeConfig");

const HilfsmaterialLinks = sequelize.define('HilfsmaterialLinks', {
  hilfsmaterialLinks_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  hilfsmaterial_id: {
    type:DataTypes.INTEGER,
    references: {
      model: Hilfsmaterial,
      key: 'hilfsmaterial_id'
    }
  },
  link: {
    type: DataTypes.STRING,
  },
  detail: {
    type: DataTypes.STRING
  }
});

module.exports = HilfsmaterialLinks;