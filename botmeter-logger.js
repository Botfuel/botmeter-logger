'use strict';

var request = require('request');

function botmeterLoggerBotbuilder (url) {
  var that = this;
  that.incomingMessages = {};

  that.receive = function (body, next) {
    that.incomingMessages[body.address.id] = body.text;
    next();
  };

  that.send = function (response, next) {
    logDocument(that.incomingMessages[response.address.id],response,next);
  };

  function logDocument(body, response, next) {
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
    indexDocument(doc, url, function (e, d){
      if (e) {
        console.log(e);
        delete(that.incomingMessages[messageId]);
      };
      if (d) {
        console.log(d);
        delete(that.incomingMessages[messageId]);
      };
    });
    next();
  };
}

function botmeterLoggerFacebook(url) {
  var that = this;

  that.logDocument = function (body, response) {
    var doc = {
      "channel": "facebook",
      "timestamp": Date.now(),
      "user_id": response.recipient.id,
      "body": body,
      "body_type": "text",
      "responses": [response.message.text]
    };
    indexDocument(doc, url, function (e, d){
    if (e) {
      console.log(e);
    };
    if (d) {
      console.log(d);
    }
  });  
  }
};

function indexDocument (document, url, cb) {
  const requestData = {
    uri: url,
    method: 'POST',
    json: document
  };
  request(requestData , function (error, response, body) {
    if(error) {
      cb(error,null);
    } else {
      cb(null,body);
    }
  });
};

module.exports = function(url) {
  return {
    botbuilder: new botmeterLoggerBotbuilder(url),
    facebook: new botmeterLoggerFacebook(url)
  }
};