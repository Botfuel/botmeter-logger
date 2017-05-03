const request = require('request');

class BotmeterLogger {
  constructor(url) {
    this.url = url;
  }

  indexDocument(document, cb) {
    const requestData = {
      uri: this.url,
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
  }
}

module.exports = BotmeterLogger;
