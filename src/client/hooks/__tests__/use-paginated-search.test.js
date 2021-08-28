import { when } from 'jest-when';
import usePaginatedSearch from '../use-paginated-search';
import useSearch from '../use-search';

jest.mock('../use-search');

describe('usePaginatedSearch', () => {
  let mockSearchVariables;
  let mockCurrentSearchVariables;
  let mockDebounceProcessSearch;
  let mockProcessSearch;

  let executeSearchQuery;
  let initialSearchVariables;

  const setupUseSearch = () => {
    when(useSearch)
      .calledWith(executeSearchQuery, { initialSearchVariables })
      .mockReturnValue({
        searchVariables: mockSearchVariables,
        currentSearchVariables: mockCurrentSearchVariables,
        debounceProcessSearch: mockDebounceProcessSearch,
        processSearch: mockProcessSearch,
      });
  };

  beforeEach(() => {
    mockSearchVariables = { search: 'search' };
    mockCurrentSearchVariables = { search: 'currentSearch' };
    mockDebounceProcessSearch = jest.fn();
    mockProcessSearch = jest.fn();

    executeSearchQuery = jest.fn();
    initialSearchVariables = { search: 'search' };

    setupUseSearch();
  });

  afterEach(() => {
    useSearch.mockReset();
  });

  describe('search return values', () => {
    let returnValues;

    beforeEach(() => {
      returnValues = usePaginatedSearch(executeSearchQuery, {
        initialSearchVariables,
      });
    });

    it('should have search variables', () => {
      expect(returnValues.searchVariables).toBe(mockSearchVariables);
    });

    it('should have current search variables', () => {
      expect(returnValues.currentSearchVariables).toBe(
        mockCurrentSearchVariables
      );
    });

    it('should have function to process a debounced search', () => {
      expect(returnValues.debounceProcessSearch).toBeDefined();
    });
  });

  it('should use search with default search variables if no search variables provided', () => {
    useSearch.mockReturnValue({ currentSearchVariables: {} });

    usePaginatedSearch(executeSearchQuery);

    expect(useSearch).toBeCalledWith(executeSearchQuery, {});
  });

  describe('currentPage', () => {
    it('should return 1 if limit is 0', () => {
      mockCurrentSearchVariables = { limit: 0 };
      setupUseSearch();

      const { currentPage } = usePaginatedSearch(executeSearchQuery, {
        initialSearchVariables,
      });

      expect(currentPage).toBe(1);
    });

    it('should return correct current page if limit specified', () => {
      mockCurrentSearchVariables = { offset: 40, limit: 10 };
      setupUseSearch();

      const { currentPage } = usePaginatedSearch(executeSearchQuery, {
        initialSearchVariables,
      });

      expect(currentPage).toBe(5);
    });

    it('should return non-decimal current page', () => {
      mockCurrentSearchVariables = { offset: 45, limit: 10 };
      setupUseSearch();

      const { currentPage } = usePaginatedSearch(executeSearchQuery, {
        initialSearchVariables,
      });

      expect(currentPage).toBe(5);
    });
  });

  describe('processPageNumber', () => {
    it('should process search for offset based on page number', () => {
      mockCurrentSearchVariables = { search: 'currentSearch', limit: 10 };
      setupUseSearch();
      const { processPageNumber } = usePaginatedSearch(executeSearchQuery, {
        initialSearchVariables,
      });

      processPageNumber(3);

      expect(mockProcessSearch).toBeCalledWith({
        limit: 10,
        search: 'currentSearch',
        offset: 20,
      });
    });
  });
});
