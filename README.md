# botmeter-logger

This library allows to log your bot conversations in the Botmeter analytics platform.

It is currently designed to be used with:
- Messenger bots ([doc here](https://dev.botmeter.io/botmeter-logger-facebook)),
- Microsoft Botbuilder bots ([doc here](https://dev.botmeter.io/botmeter-logger-microsoft)) or,
- Botfuel bots (included in the Botfuel bot SDK).

## How to setup

Install:
```
npm install --save botmeter-logger
```

## How to use

```node.js
const BotmeterLogger = require('botmeter-logger');

const botmeter = new BotmeterLogger({
  APP_ID: 'id',
  APP_KEY: 'key',
});

const document = {
  bot_version: '0.0.2',
  timestamp: 1491475013000,
  channel: 'Webchat',
  user_id: 'JohnDoe',
  user: {
    first_name: 'John',
    last_name: 'Doe',
  },
  body: 'je ne suis vraiment pas content',
  body_type: 'text',
  responses: ['Hi !', 'How are you ?'],
  state_in: 'Root',
  state_out: 'Root',
  intent: {
    name: 'Greetings',
    score: 0.8,
  },
  language: 'fr',
};

botmeter.indexDocument(document, function(error, body) {
  ...
});
```
