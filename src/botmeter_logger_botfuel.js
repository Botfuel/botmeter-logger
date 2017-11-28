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

class BotmeterLoggerBotfuel extends BotmeterLogger {
  logDocument(id, automaton, res, data, type, intent, confidence, conversationId, cb) {
    const responses = [];
    for (let i = 0; i < data.responses.length; i += 1) {
      const response = data.responses[i];
      if (response.fb !== undefined) {
        responses.push(JSON.stringify(response));
      } else if (response.smooch !== undefined) {
        responses.push(JSON.stringify(response));
      } else {
        responses.push(response);
      }
    }
    const user = res.message.user;
    const userToIndex = {};
    if (user) {
      userToIndex.name = user.name;
      if (user.first_name !== null) {
        userToIndex.first_name = user.first_name;
      }
      if (user.last_name !== null) {
        userToIndex.last_name = user.last_name;
      }
      if (user.profile_pic !== null) {
        userToIndex.profile_pic = user.profile_pic;
      }
    }
    const sentence = res.match[0];
    const doc = {
      bot_version: automaton.version,
      channel: automaton.channel,
      conversation_id: conversationId,
      user_id: id,
      user: userToIndex,
      body: sentence,
      body_type: type,
      responses,
      state_in: data.state_in,
      state_out: data.state_out,
      intent: {
        name: intent,
        score: confidence,
      },
      tags: [],
      context: [],
    };
    this.indexDocument(doc, cb);
  }
}

module.exports = BotmeterLoggerBotfuel;
