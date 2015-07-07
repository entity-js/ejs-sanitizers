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

/**
 * The sanitizers component.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule Sanitizers
 */

var async = require('async'),
    EUnknownSanitizer = require('./errors/EUnknownSanitizer'),
    sortBy = require('ejs-sortby');

var sanitizers,
    _sanitizers = {
      'trim': [{
        callback: require('./rules/trim'),
        weight: 0
      }]
    };

/**
 * Export the Sanitizers object.
 */
module.exports = {
  /**
   * Registers a new sanitizer.
   *
   * @method register
   * @param {String} name The name of the sanitizer.
   * @param {Function} cb The sanitizer callback.
   * @param {Integer} [weight=0] The weight to apply to the callback.
   * @returns {Object} Returns self.
   * @chainable
   */
  register: function (name, cb, weight) {
    'use strict';

    if (_sanitizers[name] === undefined) {
      _sanitizers[name] = [];
    }

    _sanitizers[name].push({
      callback: cb,
      weight: weight || 0
    });

    sortBy(_sanitizers[name], 'weight');
    return sanitizers;
  },

  /**
   * Determines if a sanitizer has been registered.
   *
   * @method registered
   * @param {String} name The name of the sanitizer.
   * @returns {Boolean} Returns true or false.
   */
  registered: function (name) {
    'use strict';

    return _sanitizers[name] !== undefined &&
      _sanitizers[name].length > 0;
  },

  /**
   * Unregisters a sanitizer or a sanitizers callback.
   *
   * @method unregister
   * @param {String} name The name of the sanitizer to remove.
   * @param {Function} [cb] The specific callback to remove.
   * @returns {Object} Returns self.
   * @chainable
   */
  unregister: function (name, cb) {
    'use strict';

    if (_sanitizers[name] === undefined) {
      throw new EUnknownSanitizer(name);
    }

    if (cb === undefined) {
      _sanitizers[name] = [];
    } else {
      var tmp = [];

      for (var i = 0, len = _sanitizers[name].length; i < len; i++) {
        if (_sanitizers[name][i].callback === cb) {
          continue;
        }

        tmp.push(_sanitizers[name][i]);
      }

      _sanitizers[name] = tmp;
    }

    return sanitizers;
  },

  /**
   * Attempts to sanitize the value.
   *
   * @method sanitize
   * @param {Function} done The done callback.
   *   @param {Error} done.err Any raised errors.
   *   @param {Mixed} done.value The sanitized value.
   * @param {String|Array} name The name(s) of the sanitizer(s) to run.
   * @param {Mixed} value The value to sanitize.
   * @async
   */
  sanitize: function (done, name, value) {
    'use strict';

    if (_sanitizers[name] === undefined) {
      return done(new EUnknownSanitizer(name));
    }

    var ctx = {value: value};

    function execSanitizer(sanitizer) {
      return function (next) {
        try {
          ctx.original = value;
          sanitizer.callback.call(null, next, name, ctx);
        } catch (e) {
          next(e);
        }
      };
    }

    var queue = [];
    for (var i = 0, len = _sanitizers[name].length; i < len; i++) {
      queue.push(execSanitizer(_sanitizers[name][i]));
    }

    async.series(queue, function (err) {
      done(err ? err : null, ctx.value);
    });
  },

  /**
   * Returns an object containing the registered sanitizers.
   *
   * @method sanitizers
   * @returns {Object} An object of registered sanitizers.
   */
  sanitizers: function () {
    'use strict';

    return _sanitizers;
  }
};
