import { createGraphQLClient } from '@/graphql/clients/graphql-client-factory';
import topicResourceBySlugQuery from '@/graphql/queries/topic-resource-by-slug-query';
import { when } from 'jest-when';
import getTopicResourceBySlug from '../graphql-topic-resource-by-slug-service';

jest.mock('@/graphql/clients/graphql-client-factory');

describe('getTopicResourceBySlug', () => {
  let mockFetch;

  let topicSlug;
  let resourceSlug;

  beforeEach(() => {
    mockFetch = jest.fn();

    createGraphQLClient.mockReturnValue({
      fetch: mockFetch,
    });

    topicSlug = 'topic-name';
    resourceSlug = 'resource-name';
  });

  afterEach(() => {
    createGraphQLClient.mockReset();
  });

  it('should return topic resource if found', async () => {
    const expected = {
      id: 'topic_id',
    };
    when(mockFetch)
      .calledWith(topicResourceBySlugQuery, {
        topicSlug,
        resourceSlug,
      })
      .mockReturnValue({
        topicResourceBySlug: expected,
      });

    const actual = await getTopicResourceBySlug(topicSlug, resourceSlug);

    expect(actual).toBe(expected);
  });

  it('should throw error if topic not found', async () => {
    mockFetch.mockReturnValue(null);

    await expect(
      async () => await getTopicResourceBySlug(topicSlug, resourceSlug)
    ).rejects.toThrow();
  });
});
