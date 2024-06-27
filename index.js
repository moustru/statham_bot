import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply("Добро пожаловать!"));
bot.help((ctx) => ctx.reply("Пока не могу помочь, брат, давай сам"));

bot.command("send", (ctx) => {
  return ctx.reply("Что хочешь отправить?");
});

bot.on(message(), (ctx) => {
  return ctx.reply("Брат, пока не умею общаться");
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
