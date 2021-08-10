import { useEffect, useState } from 'react';
import useDebounce from '../use-debounce';
import useSearch from '../use-search';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
jest.mock('../use-debounce');

describe('useSearch', () => {
  let mockSetSearch;
  let mockSetCurrentSearch;

  let mockExecute;
  let initialSearch;

  beforeEach(() => {
    mockSetSearch = jest.fn();
    mockSetCurrentSearch = jest.fn();
    useState.mockReturnValueOnce(['search', mockSetSearch]);
    useState.mockReturnValueOnce(['currentSearch', mockSetCurrentSearch]);

    mockExecute = jest.fn();
    initialSearch = 'search';
  });

  afterEach(() => {
    useState.mockReset();
    useEffect.mockReset();
    useDebounce.mockReset();
  });

  it('should use initial search', () => {
    useSearch(mockExecute, { initialSearch });

    expect(useState).toBeCalledWith(initialSearch);
  });

  it('should use empty string if no initial search', () => {
    useSearch(mockExecute);

    expect(useState.mock.calls[0][0]).toBe('');
  });

  it('should return search data', () => {
    const { search, currentSearch, processSearch } = useSearch(mockExecute, {
      initialSearch,
    });

    expect(search).toBe('search');
    expect(currentSearch).toBe('currentSearch');
    expect(processSearch).toBeDefined();
  });

  it('should execute search query on mount', () => {
    useEffect.mockImplementation((cb) => cb());

    useSearch(mockExecute, { initialSearch });

    expect(mockSetCurrentSearch).toBeCalledWith(initialSearch);
    expect(mockExecute).toBeCalledWith(initialSearch);
  });

  describe('processSearch', () => {
    it('should set search state', () => {
      useDebounce.mockReturnValue(jest.fn());
      const { processSearch } = useSearch(mockExecute, { initialSearch });

      processSearch('search');

      expect(mockSetSearch).toBeCalledWith('search');
    });

    it('should execute debounced search', () => {
      const mockDebounceExecute = jest.fn();
      useDebounce.mockReturnValue(mockDebounceExecute);
      const { processSearch } = useSearch(mockExecute, { initialSearch });

      processSearch('search');

      expect(mockDebounceExecute).toBeCalledWith('search');
    });
  });
});
