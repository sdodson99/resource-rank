/**
 * Check if a string has no alpha-numeric characters.
 * @param {string} value The string to check.
 * @return {boolean} True/false for has no alpha-numeric characters.
 */
function hasAlphaNumericCharacter(value) {
  const findAlphaNumericCharacterRegex = new RegExp(/[a-z0-9]/, 'gi');

  return findAlphaNumericCharacterRegex.test(value);
}

module.exports = hasAlphaNumericCharacter;
