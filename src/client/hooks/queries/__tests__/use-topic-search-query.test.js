import topicsQuery from '@/graphql/queries/topics-query';
import useLazyGraphQLRequest from '@/hooks/graphql/use-lazy-graphql-request';
import useTopicSearchQuery from '../use-topic-search-query';

jest.mock('@/hooks/graphql/use-lazy-graphql-request');

describe('useTopicSearchQuery', () => {
  afterEach(() => {
    useLazyGraphQLRequest.mockReset();
  });

  it('should return lazy GraphQL request for topic search query', () => {
    const expected = 'topics';
    useLazyGraphQLRequest.mockReturnValue({
      data: expected,
    });

    const { data: actual } = useTopicSearchQuery();

    expect(actual).toBe(expected);
    expect(useLazyGraphQLRequest).toBeCalledWith(topicsQuery);
  });

  it('should execute topic search query on execute', async () => {
    const search = 'topic_name';
    const mockExecute = jest.fn();
    useLazyGraphQLRequest.mockReturnValue({
      execute: mockExecute,
    });

    const { execute } = useTopicSearchQuery();
    await execute(search);

    expect(mockExecute).toBeCalledWith({ search });
  });
});
