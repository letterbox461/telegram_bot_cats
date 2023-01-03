const TelegramBot = require("node-telegram-bot-api");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const controller = require("./controller/cat-controller");

process.on("uncaughtException", (error, origin) => {
  console.log("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("unhandledRejection");
});

const sequelize = require("./database/sequelize");
const cats = require("./entities/cat-entity");
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

(async () => {
  try {
    await sequelize.authenticate();
    await cats.sync({ force: false });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

bot.setMyCommands(controller.commands());

bot.on("message", async (msg) => {
  controller.messageHandler(bot, msg);
});

bot.on("callback_query", async (msg) => {
  controller.callBackHandler(bot, msg);
});
