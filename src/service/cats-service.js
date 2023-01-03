const cats = require("../entities/cat-entity");
const axios = require("axios");

class CatsService {
  async removeCat(id) {
    await cats.destroy({ where: { id } });
  }

  async getCatFromDB(bot, chatId, user) {
    try {
      const catsFromDB = await cats.findAll({
        where: { user: user.toString() },
      });
      if (catsFromDB.length) {
        catsFromDB.forEach((cat) => {
          cat.catUrl.includes(".gif")
            ? bot.sendAnimation(chatId, cat.catUrl, {
                reply_markup: this.replyMarkup_remove(cat.id),
              })
            : bot.sendPhoto(chatId, cat.catUrl, {
                reply_markup: this.replyMarkup_remove(cat.id),
              });
        });
      }
    } catch {
      bot.sendMessage(chatId, "Ошибка базы данных :((");
    }
  }

  async fetchCat() {
    const cat = await axios.get("https://aws.random.cat/meow");
    if (cat.data.file.length > 53 + process.env.IMAGE_URL.length)
      return this.fetchCat();
    return cat;
  }

  async getCat(bot, chatId, userID) {
    try {
      const cat = await this.fetchCat();
      const data = cat.data.file;
      console.log(data);
      if (data.includes(".gif"))
        bot.sendAnimation(chatId, data.replace(/" "/gi, "%20"), {
          reply_markup: this.replyMarkup_add(cat.data.file, userID),
        });
      else
        bot.sendPhoto(chatId, data.replace(/" "/gi, "%20"), {
          reply_markup: this.replyMarkup_add(cat.data.file, userID),
        });
    } catch (e) {
      console.log(e);
    }
  }

  async storeCat(username, data, bot, chatId) {
    try {
      const found = await cats.findAll({
        where: { user: username.toString(), catUrl: data.split(" ")[0] },
      });

      if (found.length)
        bot.sendMessage(chatId, "Этот Котэ уже есть в избранных!");
      else {
        await cats.create({
          user: username.toString(),
          catUrl: data.split(" ")[0],
        });

        bot.sendMessage(chatId, "Котэ сохранён!");
      }
    } catch (e) {
      bot.sendMessage(chatId, "Ошибка базы данных :((");
      console.log(e);
    }
  }
  replyMarkup_add(file, userID) {
    return JSON.stringify({
      inline_keyboard: [
        [
          {
            text: "One More",
            callback_data: "one_more_cat",
          },
        ],
        [
          {
            text: "To Favorites",
            callback_data: `${file
              .replace(/" "/gi, "%20")
              .replace(process.env.IMAGE_URL, "")} ${userID}`,
          },
        ],
      ],
    });
  }
  replyMarkup_remove(id) {
    return JSON.stringify({
      inline_keyboard: [
        [
          {
            text: "Remove from favorites",
            callback_data: `remove ${id}`,
          },
        ],
      ],
    });
  }
  sayHello(bot, chatId, name) {
    bot.sendMessage(
      chatId,
      `Привет ${name}!\nНапиши в чате:\n - /cat чтобы получить фото случайного кошака\n - /favorites чтобы получить избранные фото\n - /start чтобы отобразить это сообщение \nВнимание! Фото с открытого внешнего api, автор бота не несет ответственности за содержание! `
    );
  }
}

module.exports = new CatsService();
