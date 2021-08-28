import useAvailableTopicResourcesQuery from '../../queries/use-available-topic-resources-query';
import usePaginatedSearch from '../../use-paginated-search';
import useAvailableTopicResourceSearch from '../use-available-topic-resource-search';

jest.mock('../../queries/use-available-topic-resources-query');
jest.mock('../../use-paginated-search');

describe('useAvailableTopicResourceSearch', () => {
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
    useAvailableTopicResourcesQuery.mockReturnValue({
      execute: mockExecute,
      data: mockData,
      isLoading: mockIsLoading,
      error: mockError,
    });

    mockSearchVariables = { search: 'search' };
    mockCurrentSearchVariables = { search: 'currentSearch' };
    mockDebounceProcessSearch = jest.fn();
    usePaginatedSearch.mockReturnValue({
      searchVariables: mockSearchVariables,
      currentSearchVariables: mockCurrentSearchVariables,
      debounceProcessSearch: mockDebounceProcessSearch,
    });

    topicId = '123';
    initialSearchVariables = {
      search: 'search',
    };
  });

  afterEach(() => {
    useAvailableTopicResourcesQuery.mockReset();
    usePaginatedSearch.mockReset();
  });

  it('should use available topic resource search query', () => {
    usePaginatedSearch.mockImplementation((cb) => cb(mockSearchVariables));

    useAvailableTopicResourceSearch(topicId);

    expect(mockExecute).toBeCalledWith({
      topicId,
      ...mockSearchVariables,
    });
  });

  describe('return value', () => {
    it('should have search data', () => {
      const { searchVariables, currentSearchVariables, debounceProcessSearch } =
        useAvailableTopicResourceSearch(topicId, { initialSearchVariables });

      expect(searchVariables).toBe(mockSearchVariables);
      expect(currentSearchVariables).toBe(mockCurrentSearchVariables);
      expect(debounceProcessSearch).toBe(mockDebounceProcessSearch);
    });

    it('should have query data', () => {
      const { data, isLoading, error } =
        useAvailableTopicResourceSearch(topicId);

      expect(data).toBe(mockData);
      expect(isLoading).toBe(mockIsLoading);
      expect(error).toBe(mockError);
    });
  });
});
