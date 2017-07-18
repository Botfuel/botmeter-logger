import request from 'request';
import { BOTMETER_API } from './config';

class BotmeterLogger {
  constructor({ appId, appKey }) {
    this.headers = {
      'App-Id': appId,
      'App-Key': appKey,
    };
  }

  indexDocument(document, cb) {
    const requestData = {
      uri: BOTMETER_API,
      method: 'POST',
      headers: this.headers,
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
