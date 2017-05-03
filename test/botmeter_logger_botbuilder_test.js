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
