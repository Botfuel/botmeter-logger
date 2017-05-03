const BotmeterLogger = require('./botmeter_logger');

class BotmeterLoggerBotbuilder extends BotmeterLogger {
  constructor(url) {
    super(url);
    this.incomingMessages = {};
  }

  logDocument(body, response, cb) {
    const doc = {
      bot_version: response.address.bot.id,
      channel: response.address.channelId,
      conversation_id: response.address.conversation.id,
      user_id: response.address.user.id,
      body,
      body_type: 'text',
      responses: [response.text],
    };
    this.indexDocument(doc, cb);
  }

  receive(body, next) {
    this.incomingMessages[body.address.id] = body.text;
    next();
  }

  send(response, next) {
    const messageId = response.address.id;
    this.logDocument(this.incomingMessages[messageId], response);
    delete (this.incomingMessages[messageId]);
    next();
  }
}

module.exports = BotmeterLoggerBotbuilder;
