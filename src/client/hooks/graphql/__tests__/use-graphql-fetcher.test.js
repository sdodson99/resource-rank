import { createGraphQLClient } from '@/graphql/clients/graphql-client-factory';
import { useGraphQLFetcher } from '../use-graphql-fetcher';
import useMockContext from '@/hooks/use-mock-context';
import { when } from 'jest-when';

jest.mock('@/graphql/clients/graphql-client-factory');
jest.mock('@/hooks/use-mock-context');

describe('useGraphQLFetcher', () => {
  let mockFetch;
  let mock;

  let document;
  let variables;

  beforeEach(() => {
    mockFetch = jest.fn();
    createGraphQLClient.mockReturnValue({
      fetch: mockFetch,
    });

    mock = 'standard';
    useMockContext.mockReturnValue(mock);

    document = 'graphql-document';
    variables = {
      name: 'name',
    };
  });

  afterEach(() => {
    createGraphQLClient.mockReset();
    useMockContext.mockReset();
  });

  it('should return function to execute GraphQL request', async () => {
    const expected = {
      data: {
        name: 'name',
      },
    };
    when(mockFetch).calledWith(document, variables).mockReturnValue(expected);

    const graphQlFetch = useGraphQLFetcher();
    const actual = await graphQlFetch(document, variables);

    expect(actual).toBe(expected);
  });

  it('should create GraphQL client for mock', async () => {
    const graphQlFetch = useGraphQLFetcher();
    await graphQlFetch(document, variables);

    expect(createGraphQLClient).toBeCalledWith({ mock });
  });
});
