const BotmeterLoggerBotbuilder = require('./src/botmeter_logger_botbuilder');
const BotmeterLoggerMessenger = require('./src/botmeter_logger_messenger');
const BotmeterLoggerBotfuel = require('./src/botmeter_logger_botfuel');

module.exports = (url, userKey) => {
  const fullUrl = `${url}?user_key=${userKey}`;
  return {
    botbuilder: new BotmeterLoggerBotbuilder(fullUrl),
    messenger: new BotmeterLoggerMessenger(fullUrl),
    botfuel: new BotmeterLoggerBotfuel(fullUrl),
  };
};
