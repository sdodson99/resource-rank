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
  let mockSetSearchVariables;
  let mockSetCurrentSearchVariables;

  let mockExecute;
  let initialSearchVariables;

  beforeEach(() => {
    mockSetSearchVariables = jest.fn();
    mockSetCurrentSearchVariables = jest.fn();
    useState.mockReturnValueOnce([
      {
        search: 'search',
      },
      mockSetSearchVariables,
    ]);
    useState.mockReturnValueOnce([
      {
        search: 'currentSearch',
      },
      mockSetCurrentSearchVariables,
    ]);

    mockExecute = jest.fn();
    initialSearchVariables = {
      search: 'search',
    };
  });

  afterEach(() => {
    useState.mockReset();
    useEffect.mockReset();
    useDebounce.mockReset();
  });

  it('should use initial search variables', () => {
    useSearch(mockExecute, { initialSearchVariables });

    expect(useState).toBeCalledWith(initialSearchVariables);
  });

  it('should use empty search variables if no initial search variables', () => {
    useSearch(mockExecute);

    expect(useState.mock.calls[0][0]).toEqual({});
  });

  it('should return search data', () => {
    const { searchVariables, currentSearchVariables, processSearch } =
      useSearch(mockExecute, {
        initialSearchVariables,
      });

    expect(searchVariables).toEqual({
      search: 'search',
    });
    expect(currentSearchVariables).toEqual({
      search: 'currentSearch',
    });
    expect(processSearch).toBeDefined();
  });

  it('should execute search query on mount', () => {
    useEffect.mockImplementation((cb) => cb());

    useSearch(mockExecute, { initialSearchVariables });

    expect(mockSetCurrentSearchVariables).toBeCalledWith(
      initialSearchVariables
    );
    expect(mockExecute).toBeCalledWith(initialSearchVariables);
  });

  describe('debounceProcessSearch', () => {
    it('should set search state', () => {
      useDebounce.mockReturnValue(jest.fn());
      const { debounceProcessSearch } = useSearch(mockExecute, {
        initialSearchVariables,
      });

      debounceProcessSearch('search');

      expect(mockSetSearchVariables).toBeCalledWith('search');
    });

    it('should execute debounced search', () => {
      const mockDebounceExecute = jest.fn();
      useDebounce.mockReturnValue(mockDebounceExecute);
      const { debounceProcessSearch } = useSearch(mockExecute, {
        initialSearchVariables,
      });

      debounceProcessSearch('search');

      expect(mockDebounceExecute).toBeCalledWith('search');
    });
  });

  describe('processSearch', () => {
    it('should set search state', () => {
      const { processSearch } = useSearch(mockExecute, {
        initialSearchVariables,
      });

      processSearch('search');

      expect(mockSetSearchVariables).toBeCalledWith('search');
    });

    it('should execute search', () => {
      const { processSearch } = useSearch(mockExecute, {
        initialSearchVariables,
      });

      processSearch('search');

      expect(mockExecute).toBeCalledWith('search');
    });
  });
});
