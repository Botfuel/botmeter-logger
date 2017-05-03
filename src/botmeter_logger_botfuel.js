const BotmeterLogger = require('./botmeter_logger');

class BotmeterLoggerBotfuel extends BotmeterLogger {
  logDocument(id, automaton, res, data, type, intent, confidence, conversationId, cb) {
    const responses = [];
    for (let i = 0; i < data.responses.length; i += 1) {
      const response = data.responses[i];
      if (response.fb !== undefined) {
        responses.push(JSON.stringify(response));
      } else if (response.smooch !== undefined) {
        responses.push(JSON.stringify(response));
      } else {
        responses.push(response);
      }
    }
    const user = res.message.user;
    const userToIndex = {};
    if (user) {
      userToIndex.name = user.name;
      if (user.first_name !== null) {
        userToIndex.first_name = user.first_name;
      }
      if (user.last_name !== null) {
        userToIndex.last_name = user.last_name;
      }
      if (user.profile_pic !== null) {
        userToIndex.profile_pic = user.profile_pic;
      }
    }
    const sentence = res.match[0];
    const doc = {
      bot_version: automaton.version,
      channel: automaton.channel,
      conversation_id: conversationId,
      user_id: id,
      user: userToIndex,
      body: sentence,
      body_type: type,
      responses,
      state_in: data.state_in,
      state_out: data.state_out,
      intent: {
        name: intent,
        score: confidence,
      },
      tags: [],
      language: automaton.locale,
      context: [],
    };
    this.indexDocument(doc, cb);
  }
}

module.exports = BotmeterLoggerBotfuel;
