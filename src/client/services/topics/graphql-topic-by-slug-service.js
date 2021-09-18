import { createGraphQLClient } from '../../graphql/clients/graphql-client-factory';
import topicBySlugQuery from '@/graphql/queries/topic-by-slug-query';

export default async function getTopicBySlug(slug, { mock } = {}) {
  const client = createGraphQLClient({ mock });

  const topicResult = await client.fetch(topicBySlugQuery, {
    slug,
  });

  const topic = topicResult?.topicBySlug;

  if (!topic) {
    throw new Error('Topic not found.');
  }

  return topic;
}
