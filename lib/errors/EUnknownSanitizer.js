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
 * Provides the EUnknownSanitizer error which is used when attempting to use
 * an unknown sanitizer.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule Sanitizers
 */

var util = require('util'),
    t = require('ejs-t');

/**
 * Thrown when tryng to use an unknown santizer.
 *
 * @param {String} name The name of the santizer.
 *
 * @class EUnknownSanitizer
 * @constructor
 * @extends Error
 */
function EUnknownSanitizer(name) {
  'use strict';

  EUnknownSanitizer.super_.call(this);
  Error.captureStackTrace(this, EUnknownSanitizer);

  this.message = t.t(
    'Unknown santizer ":name".',
    {':name': name}
  );
}

/**
 * Inherit from the {Error} class.
 */
util.inherits(EUnknownSanitizer, Error);

/**
 * Export the error constructor.
 */
module.exports = EUnknownSanitizer;
