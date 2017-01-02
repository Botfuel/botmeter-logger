'use strict';

var request = require('request');
var Log4js = require('log4js');
var LOGGER = Log4js.getLogger("BotmeterLogger");

var indexDocument = function (document, url, cb) {
  var requestData = {
    uri: url,
    method: 'POST',
    json: document
  };
  request(requestData, function (error, response, body) {
    if (error) {
      cb(error, null);
    } else {
      if (response.statusCode >= 300) {
        cb(body, null); // body contains the error message
      } else {
        cb(null, body);
      }
    }
  });
};

var BotmeterLoggerBotbuilder = function (url) {
  var that = this;
  that.incomingMessages = {};

  that.logDocument = function (body, response, next) {
    var doc = {
      "bot_version": response.address.bot.id,
      "channel": response.address.channelId,
      "conversation_id": response.address.conversation.id,
      "timestamp": Date.now(),
      "user_id": response.address.user.id,
      "body": body,
      "body_type": "text",
      "responses": [response.text]
    };
    indexDocument(doc, url, function (e, d) {
      if (e) {
        LOGGER.error(e);
      }
    });
  };

  that.receive = function (body, next) {
    that.incomingMessages[body.address.id] = body.text;
    next();
  };

  that.send = function (response, next) {
    var messageId = response.address.id;
    that.logDocument(that.incomingMessages[messageId], response, next);
    delete (that.incomingMessages[messageId]);
    next();
  };
};

var BotmeterLoggerFacebook = function (url) {
  var that = this;

  that.logDocument = function (body, response, cb) {
    var doc = {
      "channel": "facebook",
      "timestamp": Date.now(),
      "user_id": response.recipient.id,
      "body": body,
      "body_type": "text",
      "responses": [response.message.text]
    };
    indexDocument(doc, url, function (e, d) {
      if (e) {
        cb(e, null);
      } else {
        cb(null, d);
      }
    });
  };

};

var BotmeterLoggerBotfuel = function (url) {
  var that = this;

  that.logDocument = function (id, automaton, res, data, type, intent, confidence, sentiment, conversation_id, cb) {
    var responses = [];
    for (var i = 0; i < data.responses.length; i += 1) {
      var response = data.responses[i];
      if (response.fb !== null) {
        responses.push(JSON.stringify(response));
      } else if (response.smooch !== null) {
        responses.push(JSON.stringify(response));
      } else {
        responses.push(response);
      }
    }
    var user = res.message.user;
    var userToIndex = {};
    if (user) {
      userToIndex.name = user.name
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
    var sentence = res.match[0];
    var doc = {
        bot_version: automaton.version,
        channel: automaton.channel,
        conversation_id: conversation_id,
        timestamp: Date.now(),
        user_id: id,
        user: userToIndex,
        body: sentence,
        body_type: type,
        responses: responses,
        state_in: data.state_in,
        state_out: data.state_out,
        intent: {
          name: intent,
          score: confidence
        },
        tags: [],
        sentiment: sentiment,
        language: automaton.locale,
        context: []
    };
    indexDocument(doc, url, function (e, d) {
      if (e) {
        cb(e, null);
      } else {
        cb(null, d);
      }
    });
  };
};

module.exports = function (url) {
  return {
    botbuilder: new BotmeterLoggerBotbuilder(url),
    facebook: new BotmeterLoggerFacebook(url),
    botfuel: new BotmeterLoggerBotfuel(url)
  };
};
