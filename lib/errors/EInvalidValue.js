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
 * Provides the EInvalidValue error which is thrown when the provided value
 * is not a valid for the sanitizer.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule Sanitizers
 */

var util = require('util'),
    t = require('ejs-t');

/**
 * Thrown when trying to sanitize an unsupported value.
 *
 * @param {String} value The value being santized.
 * @param {String} name The name of the sanitizer.
 *
 * @class EInvalidValue
 * @constructor
 * @extends Error
 */
function EInvalidValue(value, name) {
  'use strict';

  EInvalidValue.super_.call(this);
  Error.captureStackTrace(this, EInvalidValue);

  this.message = t.t(
    'The value ":value" is not a supported type for the santizer ":name".',
    {':value': value, ':name': name}
  );
}

/**
 * Inherit from the {Error} class.
 */
util.inherits(EInvalidValue, Error);

/**
 * Export the error constructor.
 */
module.exports = EInvalidValue;
