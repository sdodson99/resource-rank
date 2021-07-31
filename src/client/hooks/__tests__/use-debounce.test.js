import { useCallback } from 'react';
import debounce from 'lodash.debounce';
import useDebounce from '../use-debounce';

jest.mock('react');
jest.mock('lodash.debounce');

describe('useDebounce', () => {
  afterEach(() => {
    useCallback.mockReset();
    debounce.mockReset();
  });

  it('should return callback', () => {
    const expected = jest.fn();
    useCallback.mockReturnValue(expected);

    const actual = useDebounce(() => {}, 1000);

    expect(actual).toBe(expected);
  });

  it('should create debounced callback', () => {
    const callback = jest.fn();
    const debounced = jest.fn();
    debounce.mockReturnValue(debounced);

    useDebounce(callback, 1000);

    expect(useCallback).toBeCalledWith(debounced, []);
    expect(debounce).toBeCalledWith(callback, 1000);
  });
});
