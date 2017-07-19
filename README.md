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

Environment variables:
- `PROXY_HOST`: Botfuel proxy host (default to: `https://api.botfuel.io`).

## How to use

```node.js
BotmeterLogger = require('botmeter-logger');

const botmeter = new BotmeterLogger({
  APP_ID: 'id',
  APP_KEY: 'key',
});
```
