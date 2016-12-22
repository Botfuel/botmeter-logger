'use strict';

var request = require('request');

function botmeterLoggerBotbuilder (url) {
  var that = this;
  that.incomingMessages = {};
  that.botmeterUrl = url;

  that.receive = function (body, next) {
    that.incomingMessages[body.address.id] = body.text;
    next();
  };

  that.send = function (response, next) {
    makeDocument(that.incomingMessages[response.address.id],response,next);
  };

  function makeDocument(body, response, next) {
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
    indexDocument(doc, function (e, d){
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

  function indexDocument (document, cb) {
    const requestData = {
      uri: that.botmeterUrl,
      method: 'POST',
      json: document
    };
    request(requestData , function (error, response, body) {
      if(error) {
        cb(error, null);
      } else {
        cb(null, body);
      }
    });
  }
}

function botmeterLoggerFacebook(url) {
  var that = this;
  that.botmeterUrl = url;

  that.logDocument = function (body, response) {
    var doc = {
      "channel": "facebook",
      "timestamp": Date.now(),
      "user_id": response.recipient.id,
      "body": body,
      "body_type": "text",
      "responses": [response.message.text]
    };
    indexDocument(doc, function (e, d){
    if (e) {
      console.log(e);
    };
    if (d) {
      console.log(d);
    }
  });  
  }

  function indexDocument (document, cb) {
    const requestData = {
      uri: that.botmeterUrl,
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
  }

};

module.exports = function(url) {
  return {
    botbuilder: new botmeterLoggerBotbuilder(url),
    facebook: new botmeterLoggerFacebook(url)
  }
};