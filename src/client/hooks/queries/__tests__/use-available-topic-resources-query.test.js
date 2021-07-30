import useLazyGraphQLRequest from '../../graphql/use-lazy-graphql-request';
import availableTopicResourcesQuery from '@/graphql/queries/available-topic-resources-query';
import useAvailableTopicResourcesQuery from '../use-available-topic-resources-query';

jest.mock('../../graphql/use-lazy-graphql-request');

describe('useAvailableTopicResourcesQuery', () => {
  afterEach(() => {
    useLazyGraphQLRequest.mockReset();
  });

  it('should return lazy GraphQL request for available topic resources query', () => {
    const expected = {
      data: {},
    };
    useLazyGraphQLRequest.mockReturnValue(expected);

    const actual = useAvailableTopicResourcesQuery();

    expect(actual).toBe(expected);
    expect(useLazyGraphQLRequest).toBeCalledWith(availableTopicResourcesQuery);
  });
});
