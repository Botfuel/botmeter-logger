const BotmeterLogger = require('./botmeter_logger');

class BotmeterLoggerMessenger extends BotmeterLogger {
  logDocument(body, response, cb) {
    const doc = {
      channel: 'messenger',
      user_id: response.recipient.id,
      body,
      body_type: 'text',
      responses: [response.message.text],
    };
    this.indexDocument(doc, cb);
  }
}

module.exports = BotmeterLoggerMessenger;
