import useGraphQLFetcherContext from '../../graphql/use-graphql-fetcher';
import useSWR from 'swr';
import { when } from 'jest-when';
import useGraphQLQuery from '../use-graphql-query';

jest.mock('../../graphql/use-graphql-fetcher');
jest.mock('swr');

describe('useGraphQLQuery', () => {
  let mockGraphQLFetch;

  let gqlDocument;

  beforeEach(() => {
    mockGraphQLFetch = jest.fn();
    useGraphQLFetcherContext.mockReturnValue(mockGraphQLFetch);

    gqlDocument = {};
  });

  afterEach(() => {
    useGraphQLFetcherContext.mockReset();
    useSWR.mockReset();
  });

  it('should return query data', () => {
    const expected = {};
    when(useSWR).calledWith(gqlDocument, mockGraphQLFetch).mockReturnValue({
      data: expected,
    });

    const { data } = useGraphQLQuery(gqlDocument);

    expect(data).toBe(expected);
  });

  it('should return query error', () => {
    const expected = new Error();
    when(useSWR).calledWith(gqlDocument, mockGraphQLFetch).mockReturnValue({
      error: expected,
    });

    const { error } = useGraphQLQuery(gqlDocument);

    expect(error).toBe(expected);
  });

  describe('loading state', () => {
    it('should return true when no data or error', () => {
      when(useSWR)
        .calledWith(gqlDocument, mockGraphQLFetch)
        .mockReturnValue({});

      const { loading } = useGraphQLQuery(gqlDocument);

      expect(loading).toBeTruthy();
    });

    it('should return false when data or error', () => {
      when(useSWR).calledWith(gqlDocument, mockGraphQLFetch).mockReturnValue({
        error: new Error(),
      });

      const { loading } = useGraphQLQuery(gqlDocument);

      expect(loading).toBeFalsy();
    });
  });
});
