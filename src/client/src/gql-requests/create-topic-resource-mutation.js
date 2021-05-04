import { gql } from '@apollo/client';

export default gql`
  mutation CreateTopicResource($topicId: ID!, $resourceId: ID!) {
    createTopicResource(topicId: $topicId, resourceId: $resourceId)
  }
`;
