const { Sequelize } = require("sequelize");
const path = require("path");

// const sequelize = new Sequelize(
//   "postgres",
//   process.env.PG_USERNAME,
//   process.env.PG_PASSWORD,
//   {
//     host: process.env.PG_ADDRESS,
//     dialect: "postgres",
//     logging: true,
//     port: process.env.PG_PORT,
//   }
// );

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "db.sqlite"),
});

module.exports = sequelize;
