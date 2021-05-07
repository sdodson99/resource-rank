import { gql } from '@apollo/client';

export default gql`
  query GetTopicResourceByIdQuery($topicId: ID!, $resourceId: ID!) {
    topicResource(topicId: $topicId, resourceId: $resourceId) {
      resource {
        name
        link
      }
      ratings {
        value
      }
    }
  }
`;
