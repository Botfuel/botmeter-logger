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

const BotmeterLogger = require('./botmeter_logger');
const log4js = require('log4js');

const logger = log4js.getLogger('BotmeterLoggerBotbuilder');

class BotmeterLoggerBotbuilder extends BotmeterLogger {
  constructor(auth) {
    super(auth);
    this.incomingMessages = {};

    this.logDocument = this.logDocument.bind(this);
    this.receive = this.receive.bind(this);
    this.send = this.send.bind(this);
  }

  logDocument(body, response) {
    const doc = {
      bot_version: response.address.bot.id,
      channel: response.address.channelId,
      conversation_id: response.address.conversation.id,
      user_id: response.address.user.id,
      body,
      body_type: 'text',
      responses: [response.text],
    };
    this.indexDocument(doc, (e) => {
      logger.debug(e);
    });
  }

  receive(body, next) {
    this.incomingMessages[body.address.id] = body.text;
    next();
  }

  send(response, next) {
    const messageId = response.address.id;
    this.logDocument(this.incomingMessages[messageId], response);
    delete this.incomingMessages[messageId];
    next();
  }
}

module.exports = BotmeterLoggerBotbuilder;
