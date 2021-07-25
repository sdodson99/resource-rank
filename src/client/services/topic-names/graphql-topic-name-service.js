import { createGraphQLClient } from '../../graphql/clients/graphql-client-factory';
import getTopicNameByIdQuery from '../../graphql/queries/get-topic-name-by-id-query';

export default async function getTopicName(topicId) {
  const client = createGraphQLClient();

  const topicResult = await client.fetch(getTopicNameByIdQuery, {
    id: topicId,
  });

  const topicName = topicResult?.topic?.name;

  if (!topicName) {
    throw new Error('Topic name not found.');
  }

  return topicName;
}
