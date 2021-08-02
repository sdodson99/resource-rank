import GraphQLClient from '../graphql-client';
import configuration from '@/configuration/index';
import { createGraphQLClient } from '../graphql-client-factory';

jest.mock('../graphql-client');

describe('createGraphQLClient', () => {
  it('should return GraphQLClient for configuration url', () => {
    const expected = jest.fn();
    GraphQLClient.mockReturnValue(expected);

    const actual = createGraphQLClient();

    expect(actual).toBe(expected);
    expect(GraphQLClient).toBeCalledWith(configuration.GRAPHQL_URL);
  });
});
