const cats = require("../entities/cat-entity");
const axios = require("axios");

class CatsService {
  async getCatFromDB(bot, chatId, user) {
    try {
      const catsFromDB = await cats.findAll({
        where: { user: user.toString() },
      });
      if (catsFromDB.length) {
        catsFromDB.forEach((cat) => {
          bot.sendPhoto(chatId, cat.catUrl);
        });
      }
    } catch {
      bot.sendMessage(chatId, "Ошибка базы данных :((");
    }
  }

  async fetchCat() {
    const cat = await axios.get("https://aws.random.cat/meow");
    return cat;
  }

  async getCat(bot, chatId, userID) {
    try {
      const cat = await this.fetchCat();
      console.log(cat.data.file);

      bot.sendPhoto(chatId, cat.data.file.replace(/" "/gi, "%20"), {
        reply_markup: JSON.stringify({
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
                callback_data: `${cat.data.file
                  .replace(/" "/gi, "%20")
                  .replace(process.env.IMAGE_URL, "")} ${userID}`,
              },
            ],
          ],
        }),
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
}

module.exports = new CatsService();
