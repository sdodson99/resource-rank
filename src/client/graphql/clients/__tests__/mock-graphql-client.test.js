import topicsQuery from '@/graphql/queries/topics-query';
import MockGraphQLClient from '../mock-graphql-client';
import mocks from '../../../mocks';

jest.mock('../../../mocks');

describe('MockGraphQLClient', () => {
  let client;

  let mock;
  let document;
  let variables;
  let standardData;

  beforeEach(() => {
    mock = 'super';
    client = new MockGraphQLClient(mock);

    document = topicsQuery;
    variables = {};

    standardData = {
      data: 'standard',
    };
    mocks.standard = {
      [document]: () => standardData,
    };
  });

  afterEach(() => {
    delete mocks[mock];
  });

  it('should return data for mock when mock exists for document', async () => {
    const expected = {
      data: 'super',
    };
    mocks[mock] = {
      [document]: () => expected,
    };

    const response = await client.fetch(document, variables);

    expect(response).toBe(expected);
  });

  it('should return standard mock data when mock does not exist', async () => {
    const response = await client.fetch(document, variables);

    expect(response).toBe(standardData);
  });

  it('should return empty data if no mock for document', async () => {
    const response = await client.fetch('unknownn', variables);

    expect(response).toEqual({});
  });
});
