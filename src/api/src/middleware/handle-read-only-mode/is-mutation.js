const MUTATION_QUERY_PREFIX = 'mutation';

/**
 * Check if a request is an HTTP mutation.
 * @param {object} req The HTTP request.
 * @return {boolean} True/false for is mutation.
 */
function isMutation(req) {
  if (!req) {
    return false;
  }

  const { body } = req;
  if (!body) {
    return false;
  }

  const { query } = body;
  if (!query) {
    return false;
  }

  return query.trim().startsWith(MUTATION_QUERY_PREFIX);
}

module.exports = isMutation;
