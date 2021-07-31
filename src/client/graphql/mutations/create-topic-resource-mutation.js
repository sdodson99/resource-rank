import { gql } from 'graphql-request';

const createTopicResourceMutation = gql`
  mutation CreateTopicResource($topicId: ID!, $resourceId: ID!) {
    createTopicResource(topicId: $topicId, resourceId: $resourceId)
  }
`;

export default createTopicResourceMutation;
