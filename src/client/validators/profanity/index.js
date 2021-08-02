import Filter from 'bad-words';

/**
 * Check if a value is profane.
 * @param {string} value The value to check.
 * @return {boolean} True/false for is profane.
 */
function isProfane(value) {
  const filter = new Filter();

  return filter.isProfane(value);
}

export default isProfane;
