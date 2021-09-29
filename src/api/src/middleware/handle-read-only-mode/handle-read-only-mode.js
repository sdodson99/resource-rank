const logger = require('../../monitoring/logger');
const isMutation = require('./is-mutation');

/**
 * Check if a request should be forbidden due to read only mode.
 * @param {object} req The HTTP request.
 * @param {object} readOnlyModeDataSource The data source for checking read only mode status.
 * @return {boolean} True/false for is forbidden request.
 */
async function isForbiddenReadOnlyModeRequest(req, readOnlyModeDataSource) {
  return isMutation(req) && (await readOnlyModeDataSource.isReadOnlyEnabled());
}

/**
 * Handle read only mode.
 * @param {object} req The HTTP request.
 * @param {object} res The HTTP response.
 * @param {Function} next The next middleware/controller to execute.
 * @param {object} readOnlyModeDataSource The data source for checking read only mode status.
 */
async function handleReadOnlyMode(req, res, next, readOnlyModeDataSource) {
  if (await isForbiddenReadOnlyModeRequest(req, readOnlyModeDataSource)) {
    logger.info(
      'Received forbidden request due to read-only mode. Status code',
      403
    );
    return res.sendStatus(403);
  }

  next();
}

module.exports = handleReadOnlyMode;
