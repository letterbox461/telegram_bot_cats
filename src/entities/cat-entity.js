const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Cats = sequelize.define("Cat", {
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  catUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Cats;
