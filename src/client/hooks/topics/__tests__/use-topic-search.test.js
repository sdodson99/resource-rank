import useTopicSearchQuery from '../../queries/use-topic-search-query';
import usePaginatedSearch from '../../use-paginated-search';
import useTopicSearch from '../use-topic-search';

jest.mock('../../queries/use-topic-search-query');
jest.mock('../../use-paginated-search');

describe('useTopicSearch', () => {
  let mockExecute;
  let mockData;
  let mockIsLoading;
  let mockError;
  let mockSearchVariables;
  let mockCurrentSearchVariables;
  let mockDebounceProcessSearch;

  let initialSearchVariables;

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

    mockSearchVariables = 'search';
    mockCurrentSearchVariables = 'currentSearch';
    mockDebounceProcessSearch = jest.fn();
    usePaginatedSearch.mockReturnValue({
      searchVariables: mockSearchVariables,
      currentSearchVariables: mockCurrentSearchVariables,
      debounceProcessSearch: mockDebounceProcessSearch,
    });

    initialSearchVariables = {
      search: 'search',
    };
  });

  afterEach(() => {
    useTopicSearchQuery.mockReset();
    usePaginatedSearch.mockReset();
  });

  it('should use initial search', () => {
    useTopicSearch({ initialSearchVariables });

    expect(usePaginatedSearch.mock.calls[0][1]).toEqual({
      initialSearchVariables,
    });
  });

  it('should use undefined string if no initial search', () => {
    useTopicSearch();

    expect(usePaginatedSearch.mock.calls[0][1]).toEqual({
      initialSearchVariables: undefined,
    });
  });

  it('should use topic search query for search', () => {
    useTopicSearch({ initialSearchVariables });

    expect(usePaginatedSearch.mock.calls[0][0]).toBe(mockExecute);
  });

  describe('return value', () => {
    it('should have search data', () => {
      const { searchVariables, currentSearchVariables, debounceProcessSearch } =
        useTopicSearch({
          initialSearchVariables,
        });

      expect(searchVariables).toBe(mockSearchVariables);
      expect(currentSearchVariables).toBe(mockCurrentSearchVariables);
      expect(debounceProcessSearch).toBe(mockDebounceProcessSearch);
    });

    it('should have query data', () => {
      const { data, isLoading, error } = useTopicSearch({
        initialSearchVariables,
      });

      expect(data).toBe(mockData);
      expect(isLoading).toBe(mockIsLoading);
      expect(error).toBe(mockError);
    });
  });
});
