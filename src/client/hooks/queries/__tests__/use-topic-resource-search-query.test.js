import topicResourcesQuery from '@/graphql/queries/topic-resources-query';
import useLazyGraphQLRequest from '@/hooks/graphql/use-lazy-graphql-request';
import { when } from 'jest-when';
import useTopicResourceSearchQuery from '../use-topic-resource-search-query';

jest.mock('@/hooks/graphql/use-lazy-graphql-request');

describe('useTopicResourceSearchQuery', () => {
  afterEach(() => {
    useLazyGraphQLRequest.mockReset();
  });

  it('should return lazy GraphQL request for topic resource search', () => {
    const expected = {
      data: {},
      error: {},
      isLoading: false,
    };
    when(useLazyGraphQLRequest)
      .calledWith(topicResourcesQuery)
      .mockReturnValue(expected);

    const actual = useTopicResourceSearchQuery();

    expect(actual).toBe(expected);
  });
});
