const handleReadOnlyMode = require('./handle-read-only-mode');

/**
 * Create middleware for handling read only mode.
 * @param {object} readOnlyModeDataSource The data source for checking read only mode status.
 * @return {Function} The middleware for handling read only mode.
 */
function createReadOnlyModeHandler(readOnlyModeDataSource) {
  return (req, res, next) =>
    handleReadOnlyMode(req, res, next, readOnlyModeDataSource);
}

module.exports = createReadOnlyModeHandler;
