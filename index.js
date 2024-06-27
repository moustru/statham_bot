import express from "express";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);
const PORT = process.env.PORT || 3000;

bot.start((ctx) => ctx.reply("Привет, братишка"));
bot.help((ctx) =>
  ctx.reply(
    "Сначала передай мне список каналов, через пробел.\n\nОчень важно, брат - в начале сообщения поставь 3 слэша - ///, чтобы я понимал, что это каналы.\n\nПотом просто напиши мне сообщение и я разошлю во все переданные тобой каналы.\n\nТакже не забудь, что я должен быть админом всех этих каналов"
  )
);

let channels = [];

bot.on(message(), (ctx) => {
  if (ctx.message.text?.startsWith("///")) {
    channels = [...ctx.message.text.split(" ")];
    channels.shift();
    return;
  }

  if (!channels.length) {
    ctx.reply(
      "Извини, брат, некуда отправлять. Передай мне сначала список каналов"
    );
  } else {
    channels.forEach((channel) => {
      ctx
        .copyMessage(channel)
        .then(() => {
          ctx.reply(`Брат, отправил на ${channel}`);
        })
        .catch((e) => {
          switch (true) {
            case e.message.startsWith("400"):
              ctx.reply("Не могу отправить сообщение, брат, канал не найден");
              break;
            case e.message.startsWith("403"):
              ctx.reply("Не могу отправить сообщение, брат, у меня нет прав");
              break;
            default:
              ctx.reply(
                `Не могу отправить сообщение, брат, причина - ${e.message}`
              );
          }
        });

      channels = [];
    });
  }
});

bot.launch();

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
