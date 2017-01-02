'use strict';

var request = require('request');

var indexDocument = function (document, url, cb) {
  var requestData = {
    uri: url,
    method: 'POST',
    json: document
  };
  /*jslint unparam: true */
  request(requestData, function (error, response, body) {
    if (error) {
      cb(error, null);
    } else {
      cb(null, body);
    }
  });
  /*jslint unparam: false */
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
    var messageId = response.address.id;
    indexDocument(doc, url, function (e, d) {
      if (e) {
        console.log(e);
        delete (that.incomingMessages[messageId]);
      }
      if (d) {
        console.log(d);
        delete (that.incomingMessages[messageId]);
      }
    });
    next();
  };

  that.receive = function (body, next) {
    that.incomingMessages[body.address.id] = body.text;
    next();
  };

  that.send = function (response, next) {
    that.logDocument(that.incomingMessages[response.address.id], response, next);
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

  that.log = function (id, automaton, res, data, type, intent, confidence, sentiment, conversation_id, cb) {
    var i, len, ref, response, responses, sentence, user, userToIndex, doc;
    responses = [];
    ref = data.responses;
    len = ref.length;
    for (i = 0; i < len; i += 1) {
      response = ref[i];
      if (response.fb !== null) {
        responses.push(JSON.stringify(response));
      } else if (response.smooch !== null) {
        responses.push(JSON.stringify(response));
      } else {
        responses.push(response);
      }
    }
    user = res.message.user;
    if (user) {
      userToIndex = {
        name: user.name
      };
      if (user.first_name !== null) {
        userToIndex.first_name = user.first_name;
      }
      if (user.last_name !== null) {
        userToIndex.last_name = user.last_name;
      }
      if (user.profile_pic !== null) {
        userToIndex.profile_pic = user.profile_pic;
      }
    } else {
      userToIndex = {};
    }
    sentence = res.match[0];
    doc = {
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
