import useAvailableTopicResourcesQuery from '../../queries/use-available-topic-resources-query';
import useSearch from '../../use-search';
import useAvailableTopicResourceSearch from '../use-available-topic-resource-search';

jest.mock('../../queries/use-available-topic-resources-query');
jest.mock('../../use-search');

describe('useAvailableTopicResourceSearch', () => {
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
    useAvailableTopicResourcesQuery.mockReturnValue({
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
    useAvailableTopicResourcesQuery.mockReset();
    useSearch.mockReset();
  });

  it('should use available topic resource search query', () => {
    useSearch.mockImplementation((cb) => cb(mockSearch));

    useAvailableTopicResourceSearch(topicId);

    expect(mockExecute).toBeCalledWith({ topicId, search: mockSearch });
  });

  describe('return value', () => {
    it('should have search data', () => {
      const { search, currentSearch, processSearch } =
        useAvailableTopicResourceSearch(topicId);

      expect(search).toBe(mockSearch);
      expect(currentSearch).toBe(mockCurrentSearch);
      expect(processSearch).toBe(mockProcessSearch);
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
