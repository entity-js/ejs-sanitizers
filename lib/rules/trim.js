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
 * The trim sanitizer rule.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule Sanitizers
 */

var EInvalidValue = require('../errors/EInvalidValue');

/**
 * Trim sanitizer.
 *
 * @param {Function} next The next callback.
 *   @param {Error} next.err Any raised errors.
 * @param {String} name The name of the sanitizer being run.
 * @param {Object} ctx The context, contains the original value and the value.
 * @async
 *
 * @throws {EInvalidValue} Thrown if the value is not a string.
 */
module.exports = function sanitizeTrim (next, name, ctx) {
  'use strict';

  if (typeof ctx.value !== 'string') {
    return next(new EInvalidValue(ctx.value, name));
  }

  ctx.value = ctx.value.trim();
  next();
};
