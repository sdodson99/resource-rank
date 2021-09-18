import { createGraphQLClient } from '@/graphql/clients/graphql-client-factory';
import topicBySlugQuery from '@/graphql/queries/topic-by-slug-query';
import getTopicBySlug from '../graphql-topic-by-slug-service';

jest.mock('@/graphql/clients/graphql-client-factory');

describe('getTopicBySlug', () => {
  let mockFetch;

  let slug;

  beforeEach(() => {
    mockFetch = jest.fn();

    createGraphQLClient.mockReturnValue({
      fetch: mockFetch,
    });

    slug = 'topic-name';
  });

  afterEach(() => {
    createGraphQLClient.mockReset();
  });

  it('should return topic if found', async () => {
    const expected = {
      id: 'topic_id',
    };
    mockFetch.mockReturnValue({
      topicBySlug: expected,
    });

    const actual = await getTopicBySlug(slug);

    expect(actual).toBe(expected);
  });

  it('should throw error if topic not found', async () => {
    mockFetch.mockReturnValue(null);

    await expect(async () => await getTopicBySlug(slug)).rejects.toThrow();
  });

  it('should fetch topic for slug', async () => {
    mockFetch.mockReturnValue({
      topicBySlug: {},
    });

    await getTopicBySlug(slug);

    expect(mockFetch).toBeCalledWith(topicBySlugQuery, { slug });
  });

  it('should create GraphQL client for mock when mock provided', async () => {
    const mock = 'mock';
    mockFetch.mockReturnValue({
      topicBySlug: {},
    });

    await getTopicBySlug(slug, { mock });

    expect(createGraphQLClient).toBeCalledWith({ mock });
  });
});
