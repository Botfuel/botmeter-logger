const assert = require('assert');
const BotmeterLoggerBotfuel = require('../src/botmeter_logger_botfuel');

const BOTMETER_API_URL = null;

describe('BotmeterLoggerBotfuel', () => {
  it('should index the correct document', () => {
    const blb = new BotmeterLoggerBotfuel(BOTMETER_API_URL);
    const expectedDoc = {
      user_id: 'U1',
      bot_version: 'B1',
      channel: 'CH1',
      conversation_id: 'C1',
      body: 'user text',
      body_type: 'text',
      responses: ['bot response 1', 'bot response 2'],
      language: 'fr',
      context: [],
      tags: [],
      intent: { name: 'I1', score: 0.8 },
      user: {
        name: 'john doe',
        first_name: 'john',
        last_name: 'doe',
        profile_pic: 'pic of john doe',
      },
      state_in: 'in',
      state_out: 'out',
    };
    blb.indexDocument = (computedDoc) => {
      assert.deepEqual(computedDoc, expectedDoc);
    };
    const automaton = { version: 'B1', channel: 'CH1', locale: 'fr' };
    const res = {
      match: ['user text'],
      message: {
        user: {
          name: 'john doe',
          first_name: 'john',
          last_name: 'doe',
          profile_pic: 'pic of john doe',
        },
      },
    };
    const data = {
      state_in: 'in',
      state_out: 'out',
      responses: ['bot response 1', 'bot response 2'],
    };
    blb.logDocument('U1', automaton, res, data, 'text', 'I1', 0.8, 'C1');
  });
});
