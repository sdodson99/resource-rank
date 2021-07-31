import userRatingQuery from '@/graphql/queries/user-rating-query';
import useLazyGraphQLRequest from '@/hooks/graphql/use-lazy-graphql-request';
import useTopicResourceUserRatingQuery from '../use-topic-resource-user-rating-query';

jest.mock('@/hooks/graphql/use-lazy-graphql-request');

describe('useTopicResourceUserRatingQuery', () => {
  let topicId;
  let resourceId;

  beforeEach(() => {
    topicId = '123';
    resourceId = '456';
  });

  afterEach(() => {
    useLazyGraphQLRequest.mockReset();
  });

  it('should return lazy GraphQL request for topic resource user rating query', () => {
    const expected = 'rating';
    useLazyGraphQLRequest.mockReturnValue({
      data: expected,
    });

    const { data: actual } = useTopicResourceUserRatingQuery(
      topicId,
      resourceId
    );

    expect(actual).toBe(expected);
    expect(useLazyGraphQLRequest).toBeCalledWith(userRatingQuery);
  });

  it('should execute topic resource user rating query on execute', async () => {
    const mockExecute = jest.fn();
    useLazyGraphQLRequest.mockReturnValue({
      execute: mockExecute,
    });

    const { execute } = useTopicResourceUserRatingQuery(topicId, resourceId);
    await execute();

    expect(mockExecute).toBeCalledWith({ topicId, resourceId });
  });
});
