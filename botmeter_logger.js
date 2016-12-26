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

module.exports = function (url) {
  return {
    botbuilder: new BotmeterLoggerBotbuilder(url),
    facebook: new BotmeterLoggerFacebook(url)
  };
};

