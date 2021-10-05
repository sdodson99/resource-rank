const functions = require('firebase-functions');

const logger = {
  debug: functions.logger.debug,
  info: functions.logger.info,
  warn: functions.logger.warn,
  error: functions.logger.error,
};

module.exports = logger;
