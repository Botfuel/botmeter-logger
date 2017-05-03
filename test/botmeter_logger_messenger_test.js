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
