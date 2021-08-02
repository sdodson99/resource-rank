import isProfane from '../';
import Filter from 'bad-words';

jest.mock('bad-words');

describe('isProfane', () => {
  let mockIsProfane;

  beforeEach(() => {
    mockIsProfane = jest.fn();

    Filter.mockReturnValue({
      isProfane: mockIsProfane,
    });
  });

  afterEach(() => {
    Filter.mockReset();
  });

  it('should return true when value is profane', () => {
    mockIsProfane.mockReturnValue(true);
    const value = 'bad-word';

    const result = isProfane(value);

    expect(result).toBeTruthy();
  });

  it('should return false when value is not profane', () => {
    mockIsProfane.mockReturnValue(false);
    const value = 'good-word';

    const result = isProfane(value);

    expect(result).toBeFalsy();
  });
});
