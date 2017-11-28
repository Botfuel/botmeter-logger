/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
