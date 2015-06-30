/**
 *  ______   __   __   ______  __   ______  __  __
 * /\  ___\ /\ "-.\ \ /\__  _\/\ \ /\__  _\/\ \_\ \
 * \ \  __\ \ \ \-.  \\/_/\ \/\ \ \\/_/\ \/\ \____ \
 *  \ \_____\\ \_\\"\_\  \ \_\ \ \_\  \ \_\ \/\_____\
 *   \/_____/ \/_/ \/_/   \/_/  \/_/   \/_/  \/_____/
 *                                         __   ______
 *                                        /\ \ /\  ___\
 *                                       _\_\ \\ \___  \
 *                                      /\_____\\/\_____\
 *                                      \/_____/ \/_____/
 */

var test = require('unit.js');

describe('ejs/sanitizers/rules/trim', function () {

  'use strict';

  var Sanitizers = require('../lib'),
      EInvalidValue = require('../lib/errors/EInvalidValue');

  it('sanitizerShouldBeAvailable', function () {

    test.bool(
      Sanitizers.registered('trim')
    ).isTrue();

  });

  it('shouldThrowErrorIfNotString', function (done) {

    Sanitizers.sanitize(function (err, value) {

      test.object(
        err
      ).isInstanceOf(EInvalidValue);

      done();

    }, 'trim', false);

  });

  it('shouldTrimProvidedValue', function (done) {

    Sanitizers.sanitize(function (err, value) {

      test.value(err).isNull();
      test.value(value).is('john doe');

      done();

    }, 'trim', ' john doe  ');

  });

});
