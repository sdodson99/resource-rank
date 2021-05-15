/**
 * In memory representation of read only mode.
 */
class InMemoryReadOnlyModeDataSource {
  /**
   * Initialize with read only mode value.
   * @param {boolean} readOnlyEnabled True/false for if read only mode is enabled.
   */
  constructor(readOnlyEnabled) {
    this.readOnlyEnabled = readOnlyEnabled;
  }

  /**
   * Check if read only mode is enabled.
   * @return {boolean} True/false for if read only mode is enabled.
   */
  isReadOnlyEnabled() {
    return this.readOnlyEnabled;
  }
}

module.exports = InMemoryReadOnlyModeDataSource;