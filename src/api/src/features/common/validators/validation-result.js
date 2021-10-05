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
 * @param {string} message The validation error message.
 * @return {object} The invalid result.
 */
function createInvalidResult(code, message) {
  return {
    isValid: false,
    code,
    message,
  };
}

module.exports = {
  createValidResult,
  createInvalidResult,
};
