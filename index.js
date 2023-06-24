const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const moment = require("moment");
require("dotenv").config();

let oneDayDifference = moment().subtract(1, "day").format("YYYY-MM-DD");
let twoDayDifference = moment().subtract(2, "day").format("YYYY-MM-DD");

const bot = new TelegramBot(process.env.TOKEN, {
  polling: true,
});

const url = `https://fxds-public-exchange-rates-api.oanda.com/cc-api/currencies?base=GBP&quote=NGN&data_type=general_currency_pair&start_date=${twoDayDifference}&end_date=${oneDayDifference}`;

bot.on("message", (message) => {
  console.log(message);
});

const getConversionRate = async () => {
  try {
    const { data } = await axios.get(url);
    return data.response[0].average_bid;
  } catch (error) {
    console.error("Error fetching conversion rate:", error);
    return "Error fetching conversion rate";
  }
};

const sendConversionRate = async () => {
  const chatId = process.env.GROUP_CHAT_ID; // Replace with your Telegram chat ID
  const conversionRate = await getConversionRate();
  const message = `Current Oanda GBP to NGN conversion rate: ${conversionRate}`;
  bot.sendMessage(chatId, message);
};

console.log("APPLICATION STARTED🚀");
// Schedule the job to run every hour
setInterval(sendConversionRate, 3600000);
// setInterval(sendConversionRate, 15000);
