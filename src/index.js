const BotmeterLoggerBotbuilder = require('./botmeter_logger_botbuilder');
const BotmeterLoggerMessenger = require('./botmeter_logger_messenger');
const BotmeterLoggerBotfuel = require('./botmeter_logger_botfuel');

module.exports = auth => {
  return ({
    botbuilder: new BotmeterLoggerBotbuilder(auth),
    messenger: new BotmeterLoggerMessenger(auth),
    botfuel: new BotmeterLoggerBotfuel(auth),
  });
}
