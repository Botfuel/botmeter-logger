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
const BotmeterLoggerBotbuilder = require('../src/botmeter_logger_botbuilder');

const BOTMETER_API_URL = null;

describe('BotmeterLoggerBotbuilder', () => {
  it('should index the correct document', () => {
    const blbb = new BotmeterLoggerBotbuilder(BOTMETER_API_URL);
    const expectedDoc = {
      user_id: 'U1',
      bot_version: 'B1',
      channel: 'CH1',
      conversation_id: 'C1',
      body: 'user text',
      body_type: 'text',
      responses: [
        'bot response',
      ],
    };
    blbb.indexDocument = (computedDoc) => {
      assert.deepEqual(computedDoc, expectedDoc);
    };
    const response = {
      address: {
        bot: { id: 'B1' },
        channelId: 'CH1',
        conversation: { id: 'C1' },
        user: { id: 'U1' },
      },
      text: 'bot response',
    };
    blbb.logDocument('user text', response);
  });
});
