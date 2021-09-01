import topicsQuery from '@/graphql/queries/topics-query';
import useLazyGraphQLRequest from '@/hooks/graphql/use-lazy-graphql-request';
import { when } from 'jest-when';
import useTopicSearchQuery from '../use-topic-search-query';

jest.mock('@/hooks/graphql/use-lazy-graphql-request');

describe('useTopicSearchQuery', () => {
  afterEach(() => {
    useLazyGraphQLRequest.mockReset();
  });

  it('should return lazy GraphQL request for topic search query', () => {
    const expected = {
      data: 'topics',
    };
    when(useLazyGraphQLRequest)
      .calledWith(topicsQuery)
      .mockReturnValue(expected);

    const actual = useTopicSearchQuery();

    expect(actual).toBe(expected);
  });
});
