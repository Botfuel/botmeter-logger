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

const assert = require('assert');
const BotmeterLoggerMessenger = require('../src/botmeter_logger_messenger');

const BOTMETER_API_URL = null;

describe('BotmeterLoggerMessenger', () => {
  it('should index the correct document', () => {
    const blm = new BotmeterLoggerMessenger(BOTMETER_API_URL);
    const expectedDoc = {
      channel: 'messenger',
      user_id: 'U1',
      body: 'user text',
      body_type: 'text',
      responses: [
        'bot response',
      ],
    };
    blm.indexDocument = (computedDoc) => {
      assert.deepEqual(computedDoc, expectedDoc);
    };
    const response = {
      recipient: { id: 'U1' },
      message: { text: 'bot response' },
    };
    blm.logDocument('user text', response);
  });
});
