import { useRef } from 'react';
import useSWR from 'swr';
import useGraphQLFetcherContext from '../use-graphql-fetcher';
import useGraphQLQuery from '../use-graphql-query';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(),
}));
jest.mock('swr');
jest.mock('../use-graphql-fetcher');

describe('use-graphql-query', () => {
  let mockGraphQLFetcher;

  let document;
  let variables;

  beforeEach(() => {
    useRef.mockImplementation((value) => ({
      current: value,
    }));

    mockGraphQLFetcher = jest.fn();
    useGraphQLFetcherContext.mockReturnValue(mockGraphQLFetcher);

    document = 'graphql-document';
    variables = {
      name: 'name',
    };
  });

  afterEach(() => {
    useRef.mockReset();
    useSWR.mockReset();
    useGraphQLFetcherContext.mockReset();
  });

  it('should return useSWR GraphQL result for request', () => {
    const expected = {
      data: {
        name: 'name',
      },
    };
    useSWR.mockReturnValue(expected);

    const actual = useGraphQLQuery(document, variables);

    expect(actual).toBe(expected);
    expect(useSWR).toBeCalledWith([document, variables], mockGraphQLFetcher);
  });
});
