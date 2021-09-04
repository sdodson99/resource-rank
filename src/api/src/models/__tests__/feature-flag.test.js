const FeatureFlag = require('../feature-flag');

describe('FeatureFlag', () => {
  it('should initialize with data', () => {
    const expectedName = 'name';
    const expectedIsEnabled = true;

    const { name, isEnabled } = new FeatureFlag(
      expectedName,
      expectedIsEnabled
    );

    expect(name).toBe(expectedName);
    expect(isEnabled).toBe(expectedIsEnabled);
  });
});
