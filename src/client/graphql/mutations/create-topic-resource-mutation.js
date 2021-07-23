import { gql } from 'graphql-request';

export default gql`
  mutation CreateTopicResource($topicId: ID!, $resourceId: ID!) {
    createTopicResource(topicId: $topicId, resourceId: $resourceId)
  }
`;
