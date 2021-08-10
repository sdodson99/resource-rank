import useTopicSearchQuery from '../../queries/use-topic-search-query';
import useSearch from '../../use-search';
import useTopicSearch from '../use-topic-search';

jest.mock('../../queries/use-topic-search-query');
jest.mock('../../use-search');

describe('useTopicSearch', () => {
  let mockExecute;
  let mockData;
  let mockIsLoading;
  let mockError;
  let mockSearch;
  let mockCurrentSearch;
  let mockProcessSearch;

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

    mockSearch = 'search';
    mockProcessSearch = 'currentSearch';
    mockProcessSearch = jest.fn();
    useSearch.mockReturnValue({
      search: mockSearch,
      currentSearch: mockCurrentSearch,
      processSearch: mockProcessSearch,
    });

    initialSearch = 'search';
  });

  afterEach(() => {
    useTopicSearchQuery.mockReset();
    useSearch.mockReset();
  });

  it('should use initial search', () => {
    useTopicSearch({ initialSearch });

    expect(useSearch.mock.calls[0][1]).toEqual({ initialSearch });
  });

  it('should use undefined string if no initial search', () => {
    useTopicSearch();

    expect(useSearch.mock.calls[0][1]).toEqual({ initialSearch: undefined });
  });

  it('should use topic search query for search', () => {
    useTopicSearch({ initialSearch });

    expect(useSearch.mock.calls[0][0]).toBe(mockExecute);
  });

  describe('return value', () => {
    it('should have search data', () => {
      const { search, currentSearch, processSearch } = useTopicSearch({
        initialSearch,
      });

      expect(search).toBe(mockSearch);
      expect(currentSearch).toBe(mockCurrentSearch);
      expect(processSearch).toBe(mockProcessSearch);
    });

    it('should have query data', () => {
      const { data, isLoading, error } = useTopicSearch({ initialSearch });

      expect(data).toBe(mockData);
      expect(isLoading).toBe(mockIsLoading);
      expect(error).toBe(mockError);
    });
  });
});
