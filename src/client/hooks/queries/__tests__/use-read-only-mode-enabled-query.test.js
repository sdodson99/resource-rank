import useReadOnlyModeEnabledQuery from '../use-read-only-mode-enabled-query';
import readOnlyModeEnabledQuery from '@/graphql/queries/read-only-mode-enabled-query';
import useSWR from 'swr';
import useGraphQLFetcherContext from '../../graphql/use-graphql-fetcher';

jest.mock('swr');
jest.mock('../../graphql/use-graphql-fetcher');

describe('useReadOnlyModeEnabledQuery', () => {
  let mockGraphQLFetch;

  beforeEach(() => {
    mockGraphQLFetch = jest.fn();
    useGraphQLFetcherContext.mockReturnValue(mockGraphQLFetch);
  });

  afterEach(() => {
    useSWR.mockReset();
    useGraphQLFetcherContext.mockReset();
  });

  it('should return read only mode status', () => {
    useSWR.mockReturnValue({
      data: {
        readOnlyModeEnabled: true,
      },
    });

    const result = useReadOnlyModeEnabledQuery();

    expect(result).toBeTruthy();
    expect(useSWR).toBeCalledWith(readOnlyModeEnabledQuery, mockGraphQLFetch);
  });

  it('should return false if data not available', () => {
    useSWR.mockReturnValue({
      data: null,
    });

    const result = useReadOnlyModeEnabledQuery();

    expect(result).toBeFalsy();
  });
});
