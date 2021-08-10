import useTopicResourceSearchQuery from '../../queries/use-topic-resource-search-query';
import useSearch from '../../use-search';
import useTopicResourceSearch from '../use-topic-resource-search';

jest.mock('../../queries/use-topic-resource-search-query');
jest.mock('../../use-search');

describe('useTopicResourceSearch', () => {
  let mockExecute;
  let mockData;
  let mockIsLoading;
  let mockError;
  let mockSearch;
  let mockCurrentSearch;
  let mockProcessSearch;

  let topicId;

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

    mockSearch = 'search';
    mockProcessSearch = 'currentSearch';
    mockProcessSearch = jest.fn();
    useSearch.mockReturnValue({
      search: mockSearch,
      currentSearch: mockCurrentSearch,
      processSearch: mockProcessSearch,
    });

    topicId = '123';
  });

  afterEach(() => {
    useTopicResourceSearchQuery.mockReset();
    useSearch.mockReset();
  });

  it('should use search for topic id', () => {
    useTopicResourceSearch(topicId);

    expect(useTopicResourceSearchQuery.mock.calls[0][0]).toBe(topicId);
  });

  it('should use topic resource search query', () => {
    useTopicResourceSearch(topicId);

    expect(useSearch.mock.calls[0][0]).toBe(mockExecute);
  });

  describe('return value', () => {
    it('should have search data', () => {
      const { search, currentSearch, processSearch } =
        useTopicResourceSearch(topicId);

      expect(search).toBe(mockSearch);
      expect(currentSearch).toBe(mockCurrentSearch);
      expect(processSearch).toBe(mockProcessSearch);
    });

    it('should have query data', () => {
      const { data, isLoading, error } = useTopicResourceSearch(topicId);

      expect(data).toBe(mockData);
      expect(isLoading).toBe(mockIsLoading);
      expect(error).toBe(mockError);
    });
  });
});
