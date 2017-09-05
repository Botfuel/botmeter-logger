const BotmeterLoggerBotbuilder = require('./botmeter_logger_botbuilder');
const BotmeterLoggerMessenger = require('./botmeter_logger_messenger');
const BotmeterLoggerBotfuel = require('./botmeter_logger_botfuel');
const BotmeterLogger = require('./botmeter_logger');

module.exports = auth => ({
  botbuilder: new BotmeterLoggerBotbuilder(auth),
  messenger: new BotmeterLoggerMessenger(auth),
  botfuel: new BotmeterLoggerBotfuel(auth),
  generic: new BotmeterLogger(auth),
});
