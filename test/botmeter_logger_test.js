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

const nock = require('nock');
const assert = require('assert');
const BotmeterLogger = require('../src/botmeter_logger');

const BOTMETER_API_URL = 'http://anything.botmeter.io';
const DOCUMENT = {};

describe('BotmeterLogger', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should return the error when request generates an error', () => {
    const error = 'something awful happened';
    nock(BOTMETER_API_URL)
      .post('/', DOCUMENT)
      .query(true)
      .replyWithError(error);

    new BotmeterLogger(BOTMETER_API_URL).indexDocument(DOCUMENT, (e, d) => {
      assert.equal(e.message, error);
      assert.equal(d, null);
    });
  });

  it('should return the error when request returns a 400', () => {
    const error = 'something wrong happened';
    nock(BOTMETER_API_URL)
      .post('/', DOCUMENT)
      .query(true)
      .reply(400, error);

    new BotmeterLogger(BOTMETER_API_URL).indexDocument(DOCUMENT, (e, d) => {
      assert.equal(e, error);
      assert.equal(d, null);
    });
  });

  it('should return no error when request returns a 200', () => {
    nock(BOTMETER_API_URL)
      .post('/', DOCUMENT)
      .query(true)
      .reply(200);

    new BotmeterLogger(BOTMETER_API_URL).indexDocument(DOCUMENT, (e) => {
      assert.equal(e, null);
    });
  });
});
