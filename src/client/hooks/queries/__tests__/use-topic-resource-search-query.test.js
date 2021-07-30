import topicResourceListingQuery from '@/graphql/queries/topic-resource-listing-query';
import useLazyGraphQLRequest from '@/hooks/graphql/use-lazy-graphql-request';
import useTopicResourceSearchQuery from '../use-topic-resource-search-query';

jest.mock('@/hooks/graphql/use-lazy-graphql-request');

describe('useTopicResourceSearchQuery', () => {
  let topicId;

  beforeEach(() => {
    topicId = '123';
  });

  afterEach(() => {
    useLazyGraphQLRequest.mockReset();
  });

  it('should return lazy GraphQL request for topic resource search', () => {
    const expected = 'topic_resources';
    useLazyGraphQLRequest.mockReturnValue({
      data: expected,
    });

    const { data: actual } = useTopicResourceSearchQuery(topicId);

    expect(actual).toBe(expected);
    expect(useLazyGraphQLRequest).toBeCalledWith(topicResourceListingQuery);
  });

  it('should execute topic resource search on execute', async () => {
    const resourceSearch = 'resource_name';
    const mockExecute = jest.fn();
    useLazyGraphQLRequest.mockReturnValue({
      execute: mockExecute,
    });

    const { execute } = useTopicResourceSearchQuery(topicId);
    await execute(resourceSearch);

    expect(mockExecute).toBeCalledWith({ topicId, resourceSearch });
  });
});
