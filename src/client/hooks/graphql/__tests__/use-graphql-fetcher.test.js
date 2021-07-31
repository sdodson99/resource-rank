import { createGraphQLClient } from '@/graphql/clients/graphql-client-factory';
import { useGraphQLFetcher } from '../use-graphql-fetcher';

jest.mock('@/graphql/clients/graphql-client-factory');

describe('useGraphQLFetcher', () => {
  let mockFetch;

  let document;
  let variables;

  beforeEach(() => {
    mockFetch = jest.fn();
    createGraphQLClient.mockReturnValue({
      fetch: mockFetch,
    });

    document = 'graphql-document';
    variables = {
      name: 'name',
    };
  });

  afterEach(() => {
    createGraphQLClient.mockReset();
  });

  it('should return function to execute GraphQL request', async () => {
    const expected = {
      data: {
        name: 'name',
      },
    };
    mockFetch.mockReturnValue(expected);

    const graphQlFetch = useGraphQLFetcher();
    const actual = await graphQlFetch(document, variables);

    expect(actual).toBe(expected);
    expect(mockFetch).toBeCalledWith(document, variables);
  });
});
