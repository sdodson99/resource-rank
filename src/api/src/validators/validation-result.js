/**
 * Create a valid validation result.
 * @return {object} The valid result.
 */
function createValidResult() {
  return {
    isValid: true,
  };
}

/**
 * Create an invalid validation result.
 * @param {string} code The validation error code.
 * @return {object} The invalid result.
 */
function createInvalidResult(code) {
  return {
    isValid: false,
    code,
  };
}

module.exports = {
  createValidResult,
  createInvalidResult,
};
