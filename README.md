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

There are 3 ways you can use botmeter-logger:

- generic
- messenger
- botbuilder


### Using the API

```javascript
const BotmeterLogger = require('botmeter-logger');

const genericLogger = new BotmeterLogger({
  appId: 'id',
  appKey: 'key',
}).generic;

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

genericLogger.indexDocument(document, function(error, body) {
  // Body will equal 'ok' if logging is successful
  ...
});
```

### With Messenger

```javascript
// Messenger bot response format
{
  recipient: {
    id: "recipientId"
  },
  message: {
    text: "hello, world!"
  }
}
```

```javascript
const BotmeterLogger = require('botmeter-logger');
const request = require('request');

const messengerLogger = new BotmeterLogger({
  appId: 'id',
  appKey: 'key',
}).messenger;

// User message
const requestBody = 'Hello';

// POST bot reponse to facebook
request({
  uri: 'https://graph.facebook.com/v2.6/me/messages',
  qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
  method: 'POST',
  // Messenger bot response
  json: responseJson
}, () => {
    // The user message and bot response(s) must be logged in the same document
    messengerLogger.logDocument(requestBody, responseJson, (e, r) => {
        if (e) {
          console.log('BOTMETER ERROR: ', e);
        } else {
          console.log('BOTMETER LOGGING: ', r);
        }
    })
});
```

### With Bot builder

We provide you with a middleware you can easily plug to Microsoft bot builder:

```javascript
const BotmeterLogger = require('botmeter-logger');
const builder = require('botbuilder');
const restify = require('restify');

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

const builderLogger = new BotmeterLogger({
  appId: 'id',
  appKey: 'key',
}).botbuilder;

const connector = new builder.ChatConnector({
  appId: process.env.APP_ID,
  appPassword: process.env.APP_PASSWORD
});

const bot = new builder.UniversalBot(connector);

server.post('/api/messages', connector.listen());

bot.use(builderLogger);

bot.dialog('/', (session) => session.send("Hello World"));
```
