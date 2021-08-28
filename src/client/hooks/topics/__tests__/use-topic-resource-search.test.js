import useTopicResourceSearchQuery from '../../queries/use-topic-resource-search-query';
import usePaginatedSearch from '../../use-paginated-search';
import useTopicResourceSearch from '../use-topic-resource-search';

jest.mock('../../queries/use-topic-resource-search-query');
jest.mock('../../use-paginated-search');

describe('useTopicResourceSearch', () => {
  let mockExecute;
  let mockData;
  let mockIsLoading;
  let mockError;
  let mockSearchVariables;
  let mockCurrentSearchVariables;
  let mockDebounceProcessSearch;

  let topicId;
  let initialSearchVariables;

  beforeEach(() => {
    mockExecute = jest.fn();
    mockData = {};
    mockIsLoading = false;
    mockError = new Error();
    useTopicResourceSearchQuery.mockReturnValue({
      execute: mockExecute,
      data: mockData,
      isLoading: mockIsLoading,
      error: mockError,
    });

    mockSearchVariables = { resourceSearch: 'search' };
    mockCurrentSearchVariables = { resourceSearch: 'currentSearch' };
    mockDebounceProcessSearch = jest.fn();
    usePaginatedSearch.mockReturnValue({
      searchVariables: mockSearchVariables,
      currentSearchVariables: mockCurrentSearchVariables,
      debounceProcessSearch: mockDebounceProcessSearch,
    });

    initialSearchVariables = {};
    topicId = '123';
  });

  afterEach(() => {
    useTopicResourceSearchQuery.mockReset();
    usePaginatedSearch.mockReset();
  });

  it('should execute topic resource search query', () => {
    useTopicResourceSearch(topicId);

    const executePaginatedSearchQuery = usePaginatedSearch.mock.calls[0][0];
    executePaginatedSearchQuery(initialSearchVariables);

    expect(mockExecute).toBeCalledWith({
      ...initialSearchVariables,
      topicId,
    });
  });

  describe('return value', () => {
    it('should have search data', () => {
      const { searchVariables, currentSearchVariables, debounceProcessSearch } =
        useTopicResourceSearch(topicId, { initialSearchVariables });

      expect(searchVariables).toBe(mockSearchVariables);
      expect(currentSearchVariables).toBe(mockCurrentSearchVariables);
      expect(debounceProcessSearch).toBe(mockDebounceProcessSearch);
    });

    it('should have query data', () => {
      const { data, isLoading, error } = useTopicResourceSearch(topicId);

      expect(data).toBe(mockData);
      expect(isLoading).toBe(mockIsLoading);
      expect(error).toBe(mockError);
    });
  });
});
