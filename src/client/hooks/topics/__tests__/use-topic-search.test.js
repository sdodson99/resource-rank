import { useEffect, useState } from 'react';
import useTopicSearchQuery from '../../queries/use-topic-search-query';
import useTopicSearch from '../use-topic-search';
import useDebounce from '../../use-debounce';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
jest.mock('../../queries/use-topic-search-query');
jest.mock('../../use-debounce');

describe('useTopicSearch', () => {
  let mockSetSearch;
  let mockSetCurrentSearch;
  let mockExecute;
  let mockData;
  let mockIsLoading;
  let mockError;

  let initialSearch;

  beforeEach(() => {
    mockExecute = jest.fn();
    mockData = {};
    mockIsLoading = false;
    mockError = new Error();
    useTopicSearchQuery.mockReturnValue({
      execute: mockExecute,
      data: mockData,
      isLoading: mockIsLoading,
      error: mockError,
    });

    mockSetSearch = jest.fn();
    mockSetCurrentSearch = jest.fn();
    useState.mockReturnValueOnce(['search', mockSetSearch]);
    useState.mockReturnValueOnce(['currentSearch', mockSetCurrentSearch]);

    initialSearch = 'search';
  });

  afterEach(() => {
    useTopicSearchQuery.mockReset();
    useState.mockReset();
    useEffect.mockReset();
    useDebounce.mockReset();
  });

  it('should use initial search', () => {
    useTopicSearch({ initialSearch });

    expect(useState).toBeCalledWith(initialSearch);
  });

  it('should use empty string if no initial search', () => {
    useTopicSearch();

    expect(useState).toBeCalledWith('');
  });

  describe('return value', () => {
    it('should have search data', () => {
      const { search, currentSearch, processSearch } = useTopicSearch({
        initialSearch,
      });

      expect(search).toBe('search');
      expect(currentSearch).toBe('currentSearch');
      expect(processSearch).toBeDefined();
    });

    it('should have query data', () => {
      const { data, isLoading, error } = useTopicSearch({ initialSearch });

      expect(data).toBe(mockData);
      expect(isLoading).toBe(mockIsLoading);
      expect(error).toBe(mockError);
    });
  });

  it('should execute topic search query on mount', () => {
    useEffect.mockImplementation((cb) => cb());

    useTopicSearch({ initialSearch });

    expect(mockSetCurrentSearch).toBeCalledWith(initialSearch);
    expect(mockExecute).toBeCalledWith(initialSearch);
  });

  describe('processSearch', () => {
    it('should set search state', () => {
      useDebounce.mockReturnValue(jest.fn());
      const { processSearch } = useTopicSearch({ initialSearch });

      processSearch('search');

      expect(mockSetSearch).toBeCalledWith('search');
    });

    it('should execute debounced topic search', () => {
      const mockDebounceExecute = jest.fn();
      useDebounce.mockReturnValue(mockDebounceExecute);
      const { processSearch } = useTopicSearch({ initialSearch });

      processSearch('search');

      expect(mockDebounceExecute).toBeCalledWith('search');
    });
  });
});
