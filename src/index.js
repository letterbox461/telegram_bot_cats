const TelegramBot = require("node-telegram-bot-api");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const catsService = require("./service/cats-service");

const sequelize = require("./database/sequelize");
const cats = require("./entities/cat-entity");

(async () => {
  try {
    await sequelize.authenticate();
    await cats.sync();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "Начальное приветствие" },
  { command: "/cat", description: "Получение фото кота" },
  { command: "/favorites", description: "Получение избранных фото" },
]);

process.on("uncaughtException", (error, origin) => {
  console.log("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("unhandledRejection");
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  try {
    console.log(msg);
    switch (msg.text) {
      case "/start": {
        bot.sendMessage(
          chatId,
          `Привет ${msg.from.first_name}!\nНапиши в чате:\n - /cat чтобы получить фото случайного кошака\n - /favorites чтобы получить избранные фото\n - /start чтобы отобразить это сообщение \nВнимание! Фото с открытого внешнего api, автор бота не несет ответственности за содержание! `
        );
        break;
      }
      case "/cat": {
        await catsService.getCat(bot, chatId, msg.from.id);
        break;
      }

      case "/favorites": {
        await catsService.getCatFromDB(bot, chatId, msg.from.id);
        break;
      }

      default: {
        bot.sendMessage(chatId, "Неизвестная команда");
      }
    }
  } catch (err) {
    bot.sendMessage(chatId, "Произошла ошибка");
  }
});

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;

  switch (data) {
    case "one_more_cat": {
      await catsService.getCat(bot, chatId, msg.from.id);
      break;
    }
    default: {
      await catsService.storeCat(
        data.split(" ")[1],
        process.env.IMAGE_URL + data,
        bot,
        chatId
      );
      break;
    }
  }
});