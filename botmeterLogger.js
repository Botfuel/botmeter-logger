'use strict';

var request = require('request');

function botmeterLoggerMicrosoft (url) {
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
      "user": {
        "name" : ""
      },
      "body": body,
      "body_type": "text",
      "responses": [response.text],
      "state_in": "root",
      "state_out": "root",
      "intent":
      {
        "name": "root",
        "score": 1
      },
      "tags": [],
      "sentiment": 0,
      "language": "fr",
      "context": []
    };
    indexDocument(doc);
    delete(that.incomingMessages[response.address.id]);
    next();
  };

  function indexDocument (document) {
    const requestData = {
      uri: that.botmeterUrl,
      method: 'POST',
      json: document
    };
    request(requestData , function (error, response, body) {
      if(error) {
        console.log(error);
      } else {
        console.log(response.statusCode, body);
      }
    });
  }
}

function botmeterLoggerMessenger(url) {
  var that = this;
  that.botmeterUrl = url;

  that.makeDocument = function (body, response) {
      var document = {
          "bot_version": "0.1",
          "channel": "facebook",
          "conversation_id": "1",
          "timestamp": Date.now(),
          "user_id": response.recipient.id,
          "user": {
            "name" : ""
          },
          "body": body,
          "body_type": "text",
          "responses": [response.message.text],
          "state_in": "root",
          "state_out": "root",
          "intent":
          {
            "name": "root",
            "score": 1
          },
          "tags": [],
          "sentiment": 0,
          "language": "fr",
          "context": []
      }
    console.log(document);
    return document;
  }

  that.indexDocument = function (document) {
    const requestData = {
      uri: that.botmeterUrl,
      method: 'POST',
      json: document
    };
    request(requestData , function (error, response, body) {
      if(error) {
        console.log(error);
      } else {
        console.log(response.statusCode, body);
      }
    });
  }

};

module.exports = function(url, platform) {
  switch (platform) {
    case "microsoft":
      return new botmeterLoggerMicrosoft(url);
      break;
    case "messenger":
      return new botmeterLoggerMessenger(url);
      break;
  }
};