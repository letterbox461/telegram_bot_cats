const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postgres",
  process.env.PG_USERNAME,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_ADDRESS,
    dialect: "postgres",
    logging: true,
    port: process.env.PG_PORT,
  }
);

module.exports = sequelize;
