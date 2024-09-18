/**
 * This is where you will export all the files that contain
 * the middlewares functions within the middlewares folder for easy access.
 */
const logger = require('./logger');
const auth = require('./authentication/auth');

module.exports = {
  logger,
  auth,
};
