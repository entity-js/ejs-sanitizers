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

describe('ejs/sanitizers', function () {

  'use strict';

  var EUnknownSanitizer = require('../lib/errors/EUnknownSanitizer');

  var Sanitizers;

  beforeEach(function () {

    Sanitizers = require('../lib');

  });

  afterEach(function () {

    var name = require.resolve('../lib');
    delete require.cache[name];

  });

  describe('Sanitizers.register()', function () {

    it('shouldBeAbleToRegisterNewSanitizer', function () {

      var sanitizer = function () {};

      Sanitizers.register('test', sanitizer);

      test.array(
        Sanitizers.sanitizers().test
      ).hasLength(1).is([{
        callback: sanitizer,
        weight: 0
      }]);

    });

    it('shouldBeAbleToRegisterMultipleCallbacks', function () {

      var sanitizer1 = function () {},
          sanitizer2 = function () {},
          sanitizer3 = function () {};

      Sanitizers.register('test', sanitizer1);
      Sanitizers.register('test', sanitizer2);
      Sanitizers.register('test', sanitizer3);

      test.array(
        Sanitizers.sanitizers().test
      ).hasLength(3).is([{
        callback: sanitizer1,
        weight: 0
      }, {
        callback: sanitizer2,
        weight: 0
      }, {
        callback: sanitizer3,
        weight: 0
      }]);

    });

    it('multipleCallbacksShouldBeSortedByWeight', function () {

      var sanitizer1 = function () {},
          sanitizer2 = function () {},
          sanitizer3 = function () {};

      Sanitizers.register('test', sanitizer1, 10);
      Sanitizers.register('test', sanitizer2, -10);
      Sanitizers.register('test', sanitizer3);

      test.array(
        Sanitizers.sanitizers().test
      ).hasLength(3).is([{
        callback: sanitizer2,
        weight: -10
      }, {
        callback: sanitizer3,
        weight: 0
      }, {
        callback: sanitizer1,
        weight: 10
      }]);

    });

  });

  describe('Sanitizers.registered()', function () {

    it('shouldReturnFalseIfTheSanitizerHasntBeenRegistered', function () {

      test.bool(
        Sanitizers.registered('test')
      ).isNotTrue();

    });

    it('shouldReturnFalseIfTheSanitizerHasBeenRegisteredButEmpty', function () {

      Sanitizers.sanitizers().test = [];

      test.bool(
        Sanitizers.registered('test')
      ).isNotTrue();

    });

    it('shouldReturnTrueIfSanitizerHasBeenRegistered', function () {

      var sanitizer = function () {};

      Sanitizers.register('test', sanitizer);

      test.bool(
        Sanitizers.registered('test')
      ).isTrue();

    });

  });

  describe('Sanitizers.unregister()', function () {

    it('shouldThrowAnErrorIfSanitizerDoesntExist', function () {

      test.exception(function () {
        Sanitizers.unregister('test');
      }).isInstanceOf(EUnknownSanitizer);

    });

    it('shouldUnregisterAllSanitizers', function () {

      var sanitizer1 = function () {},
          sanitizer2 = function () {},
          sanitizer3 = function () {};

      Sanitizers.register('test', sanitizer1, 10);
      Sanitizers.register('test', sanitizer2, -10);
      Sanitizers.register('test', sanitizer3);

      Sanitizers.unregister('test');
      test.array(
        Sanitizers.sanitizers().test
      ).hasLength(0);

    });

    it('shouldUnregisterSpecifiedCallback', function () {

      var sanitizer1 = function () {},
          sanitizer2 = function () {},
          sanitizer3 = function () {};

      Sanitizers.register('test', sanitizer1, 10);
      Sanitizers.register('test', sanitizer2, -10);
      Sanitizers.register('test', sanitizer3);

      Sanitizers.unregister('test', sanitizer2);
      test.array(
        Sanitizers.sanitizers().test
      ).hasLength(2).is([{
        callback: sanitizer3,
        weight: 0
      }, {
        callback: sanitizer1,
        weight: 10
      }]);

    });

    it('shouldUnregisterSpecifiedCallbackDuplicates', function () {

      var sanitizer1 = function () {},
          sanitizer2 = function () {},
          sanitizer3 = function () {};

      Sanitizers.register('test', sanitizer1, 10);
      Sanitizers.register('test', sanitizer2, -10);
      Sanitizers.register('test', sanitizer3);
      Sanitizers.register('test', sanitizer2, 90);

      Sanitizers.unregister('test', sanitizer2);
      test.array(
        Sanitizers.sanitizers().test
      ).hasLength(2).is([{
        callback: sanitizer3,
        weight: 0
      }, {
        callback: sanitizer1,
        weight: 10
      }]);

    });

  });

  describe('Sanitizers.sanitize()', function () {

    it('shouldThrowAnErrorIfSanitizerDoesntExist', function (done) {

      Sanitizers.sanitize(function (err, value) {

        test.object(
          err
        ).isInstanceOf(EUnknownSanitizer);

        done();

      }, 'test', 'test');

    });

    it('shouldExecuteCorrectSanitizers', function (done) {

      var s1 = false, s2 = false, s3 = false,
          sanitizer1 = function (next, name, ctx) {
            s1 = true;
            next();
          },
          sanitizer2 = function (next, name, ctx) {
            s2 = true;
            next();
          },
          sanitizer3 = function (next, name, ctx) {
            s3 = true;
            next();
          };

      Sanitizers.register('test', sanitizer1);
      Sanitizers.register('test2', sanitizer2);
      Sanitizers.register('test', sanitizer3);

      Sanitizers.sanitize(function (err, value) {

        test.value(err).isNull();

        test.bool(s1).isTrue();
        test.bool(s2).isNotTrue();
        test.bool(s3).isTrue();

        done();

      }, 'test', 'test');

    });

    it('shouldMarkAsInvalidIfAnErrorIsSubmitted', function (done) {

      var s1 = false, s2 = false, s3 = false,
          sanitizer1 = function (next, name, ctx) {
            s1 = true;
            next();
          },
          sanitizer2 = function (next, name, ctx) {
            s2 = true;
            next(new Error());
          },
          sanitizer3 = function (next, name, ctx) {
            s3 = true;
            next();
          };

      Sanitizers.register('test', sanitizer1);
      Sanitizers.register('test', sanitizer2);
      Sanitizers.register('test', sanitizer3);

      Sanitizers.sanitize(function (err) {

        test.object(err).isInstanceOf(Error);

        test.bool(s1).isTrue();
        test.bool(s2).isTrue();
        test.bool(s3).isNotTrue();

        done();

      }, 'test', 'test');

    });

    it('shouldCaptureExceptionsAndFail', function (done) {

      var s1 = false, s2 = false, s3 = false,
          sanitizer1 = function (next, name, ctx) {
            s1 = true;
            next();
          },
          sanitizer2 = function (next, name, ctx) {
            if (ctx.value === 'test') {
              throw new Error();
            }

            s2 = true;
            next();
          },
          sanitizer3 = function (next, name, ctx) {
            s3 = true;
            next();
          };

      Sanitizers.register('test', sanitizer1);
      Sanitizers.register('test', sanitizer2);
      Sanitizers.register('test', sanitizer3);

      Sanitizers.sanitize(function (err) {

        test.object(err).isInstanceOf(Error);

        test.bool(s1).isTrue();
        test.bool(s2).isNotTrue();
        test.bool(s3).isNotTrue();

        done();

      }, 'test', 'test');

    });

  });

});
