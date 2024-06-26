import axios from "axios";
import { config } from "dotenv";
import express from "express";

config();
const app = express();

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/sendMessage`;
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.post("/new-event", async (req, res) => {
  const { message } = req.body;

  const messageText = message?.text?.toLowerCase()?.trim();
  const chatId = message?.chat?.id;

  if (!messageText || !chatId) {
    return res.sendStatus(400);
  }

  let responseText = "Не знаю, что сказать";

  if (messageText === "Антон") {
    responseText = "Знаю этого типа";
  }

  try {
    await axios.post(TELEGRAM_API, {
      chat_id: chatId,
      text: responseText,
    });

    res.send("Done");
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
