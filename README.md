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
  bot_version: '1.0.2',
  timestamp: 1491475013000,
  channel: 'Webchat',
  user_id: 'JohnDoe',
  user: {
    first_name: 'John',
    last_name: 'Doe',
  },
  body: 'Hello',
  body_type: 'text',
  responses: ['Hi !', 'How are you ?'],
  state_in: 'Root',
  state_out: 'Root',
  intent: {
    name: 'Greetings',
    score: 0.8,
  },
  language: 'en',
};

genericLogger.indexDocument(document, function(error, body) {
  // Body will equal 'ok' if logging is successful
  ...
});
```

### With Messenger

Log the message inside the POST request callback made when the bot replies (the user message and bot response(s) must be logged in the same document) (see right pane).

<a type="button" target="_blank" class="button"           href="https://github.com/Botfuel/sample-bot-messenger"><i style="padding-right: 6px;" class="fa fa-github fa-lg"></i> See our sample bot</a>

```javascript
const BotmeterLogger = require('botmeter-logger');
const request = require('request');

const messengerLogger = new BotmeterLogger({
  appId: '<APP_ID>',
  appKey: '<APP_KEY>',
}).messenger;

// User message
const requestBody = 'Hello';

// Bot response
const responseJson = {
    recipient: {
      id: senderId,
    },
    message: {
      text: 'Hello World',
    },
  };


// POST bot reponse to facebook
request({
  uri: 'https://graph.facebook.com/v2.6/me/messages',
  qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
  method: 'POST',
  json: responseJson
}, () => {
    // The user message and bot response(s) must be logged in the same document
    messengerLogger.logDocument(requestBody, responseJson, (e, r) => {
        if (e) {
          console.log('Botmeter error: ', e);
        } else {
          console.log('Botmeter logging: ', r);
        }
    })
});
```


### With Bot builder

We provide a middleware that you can easily plug to Microsoft bot builder (see right pane).

<a type="button" target="_blank" class="button" href="https://github.com/Botfuel/sample-bot-botbuilder"><i style="padding-right: 6px;" class="fa fa-github fa-lg"></i> See our sample bot</a>

```javascript
const BotmeterLogger = require('botmeter-logger');
const builder = require('botbuilder');
const restify = require('restify');

// Create a server
const server = restify.createServer();
server.listen(process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

// Instantiate the Bot builder connector and bot
const connector = new builder.ChatConnector({
  // can be left undefined when testing with emulator
  appId: process.env.MICROSOFT_APP_ID,
  // can be left undefined when testing with emulator
  appPassword: process.env.MICROSOFT_APP_PASSWORD,
});

const bot = new builder.UniversalBot(connector);

// Instantiate Bot builder logger
const builderLogger = new BotmeterLogger({
  appId: '<APP_ID>',
  appKey: '<APP_KEY>',
}).botbuilder;

// Plug it
server.post('/api/messages', connector.listen());

bot.use(builderLogger);

bot.dialog('/', (session) => session.send('Hello World'));
```
