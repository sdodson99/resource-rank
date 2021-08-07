import { createGraphQLClient } from '../../graphql/clients/graphql-client-factory';
import topicResourceBySlugQuery from '@/graphql/queries/topic-resource-by-slug-query';

export default async function getTopicResourceBySlug(topicSlug, resourceSlug) {
  const client = createGraphQLClient();

  const topicResourceResult = await client.fetch(topicResourceBySlugQuery, {
    topicSlug,
    resourceSlug,
  });

  const topicResource = topicResourceResult?.topicResourceBySlug;

  if (!topicResource) {
    throw new Error('Topic resource not found.');
  }

  return topicResource;
}
