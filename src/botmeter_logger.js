import request from 'request';
import { BOTMETER_API } from './config';

class BotmeterLogger {
  /**
   * Clean parameters object by filtering out undefineds.
   *
   * @param {Object} params the parameters object.
   * @returns {Object} the clean object of parameters
   * @static
   * @memberof ApiResource
   */
  static cleanParameters = params =>
    Object.keys(params).reduce((returns, element) => {
      if (params[element] !== undefined) {
        return { ...returns, [element]: params[element] };
      }
      return returns;
    }, {});

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
      json: this.constructor.cleanParameters(document),
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
