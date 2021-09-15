import GraphQLClient from '../graphql-client';
import MockGraphQLClient from '../mock-graphql-client';
import configuration from '@/configuration/index';
import { createGraphQLClient } from '../graphql-client-factory';
import { when } from 'jest-when';

jest.mock('../graphql-client');
jest.mock('../mock-graphql-client');

describe('createGraphQLClient', () => {
  beforeEach(() => {
    configuration.ENVIRONMENT = 'testing';
  });

  it('should return GraphQLClient for configuration url', () => {
    const expected = {};
    when(GraphQLClient)
      .calledWith(configuration.GRAPHQL_URL)
      .mockReturnValue(expected);

    const actual = createGraphQLClient();

    expect(actual).toBe(expected);
  });

  it('should return MockGraphQLClient when mock provided', () => {
    const mock = 'default';
    const expected = {};
    when(MockGraphQLClient).calledWith(mock).mockReturnValue(expected);

    const actual = createGraphQLClient({ mock });

    expect(actual).toBe(expected);
  });

  it('should not return MockGraphQLClient when mock provided in production', () => {
    const mock = 'default';
    configuration.ENVIRONMENT = 'production';
    const expected = {};
    when(MockGraphQLClient).calledWith(mock).mockReturnValue(expected);

    const actual = createGraphQLClient({ mock });

    expect(actual).not.toBe(expected);
  });
});
