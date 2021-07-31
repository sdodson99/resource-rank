import createTopicResourceMutation from '@/graphql/mutations/create-topic-resource-mutation';
import useLazyGraphQLRequest from '@/hooks/graphql/use-lazy-graphql-request';
import useCreateTopicResourceMutation from '../use-create-topic-resource-mutation';

jest.mock('@/hooks/graphql/use-lazy-graphql-request');

describe('useTopicSearchQuery', () => {
  let topicId;
  let resourceId;

  beforeEach(() => {
    topicId = '123';
    resourceId = '456';
  });

  afterEach(() => {
    useLazyGraphQLRequest.mockReset();
  });

  it('should return lazy GraphQL request for create topic resource mutation', () => {
    const expected = true;
    useLazyGraphQLRequest.mockReturnValue({
      isLoading: expected,
    });

    const { isLoading: actual } = useCreateTopicResourceMutation();

    expect(actual).toBe(expected);
    expect(useLazyGraphQLRequest).toBeCalledWith(createTopicResourceMutation);
  });

  it('should execute create topic resource mutation on execute', async () => {
    const mockExecute = jest.fn();
    useLazyGraphQLRequest.mockReturnValue({
      execute: mockExecute,
    });

    const { execute } = useCreateTopicResourceMutation();
    await execute(topicId, resourceId);

    expect(mockExecute).toBeCalledWith({ topicId, resourceId });
  });
});
