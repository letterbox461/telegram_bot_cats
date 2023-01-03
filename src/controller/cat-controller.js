const TelegramBot = require("node-telegram-bot-api");
const catsService = require("../service/cats-service");

class CatController {
  constructor() {
    this.commands = [
      { command: "/start", description: "Начальное приветствие" },
      { command: "/cat", description: "Получение фото кота" },
      { command: "/favorites", description: "Получение избранных фото" },
    ];
  }

  getCommands() {
    return this.commands;
  }

  async messageHandler(bot, msg) {
    const chatId = msg.chat.id;
    try {
      console.log(msg);
      switch (msg.text) {
        case "/start": {
          catsService.sayHello(bot, chatId, msg.from.first_name);
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
  }

  async callBackHandler(bot, msg) {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    switch (data.split(" ")[0]) {
      case "one_more_cat": {
        await catsService.getCat(bot, chatId, msg.from.id);
        break;
      }
      case "remove": {
        const id = data.split(" ")[1];
        await catsService.removeCat(id);
        bot.sendMessage(chatId, `Cat №${id} removed`);
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
  }
}

module.exports = new CatController();
