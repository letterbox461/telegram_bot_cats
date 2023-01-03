const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const TelegramBot = require("node-telegram-bot-api");
const controller = require("./controller/cat-controller");
const sequelize = require("./database/sequelize");
const cats = require("./entities/cat-entity");

process.on("uncaughtException", (error, origin) => {
  console.log(error, origin);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(reason, promise);
});

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

bot.setMyCommands(controller.getCommands());

bot.on("message", async (msg) => {
  controller.messageHandler(bot, msg);
});

bot.on("callback_query", async (msg) => {
  controller.callBackHandler(bot, msg);
});
