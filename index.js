const request = require('request');
const Log4js = require('log4js');

const LOGGER = Log4js.getLogger('BotmeterLogger');

const indexDocument = (document, url, cb) => {
  const requestData = {
    uri: url,
    method: 'POST',
    json: document,
  };
  request(requestData, (error, response, body) => {
    if (error) {
      cb(error, null);
    } else if (response.statusCode >= 300) {
      cb(body, null); // body contains the error message
    } else {
      cb(null, body);
    }
  });
};

const BotmeterLoggerBotbuilder = (url) => {
  this.incomingMessages = {};
  this.logDocument = (body, response) => {
    const doc = {
      bot_version: response.address.bot.id,
      channel: response.address.channelId,
      conversation_id: response.address.conversation.id,
      user_id: response.address.user.id,
      body,
      body_type: 'text',
      responses: [response.text],
    };
    indexDocument(doc, url, (e) => {
      if (e) {
        LOGGER.error(e);
      }
    });
  };
  this.receive = (body, next) => {
    this.incomingMessages[body.address.id] = body.text;
    next();
  };
  this.send = (response, next) => {
    const messageId = response.address.id;
    this.logDocument(this.incomingMessages[messageId], response);
    delete (this.incomingMessages[messageId]);
    next();
  };
};

const BotmeterLoggerMessenger = (url) => {
  this.logDocument = (body, response, cb) => {
    const doc = {
      channel: 'messenger',
      user_id: response.recipient.id,
      body,
      body_type: 'text',
      responses: [response.message.text],
    };
    indexDocument(doc, url, (e, d) => {
      if (e) {
        cb(e, null);
      } else {
        cb(null, d);
      }
    });
  };
};

const BotmeterLoggerBotfuel = (url) => {
  this.logDocument = (id, automaton, res, data, type, intent, confidence, conversationId, cb) => {
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
    indexDocument(doc, url, (e, d) => {
      if (e) {
        cb(e, null);
      } else {
        cb(null, d);
      }
    });
  };
};

module.exports = (url, userKey) => {
  const fullUrl = `${url}?user_key=${userKey}`;
  return {
    botbuilder: new BotmeterLoggerBotbuilder(fullUrl),
    messenger: new BotmeterLoggerMessenger(fullUrl),
    botfuel: new BotmeterLoggerBotfuel(fullUrl),
  };
};
