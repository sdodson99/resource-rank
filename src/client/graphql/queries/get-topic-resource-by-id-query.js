import { gql } from 'graphql-request';

export default gql`
  query GetTopicResourceByIdQuery($topicId: ID!, $resourceId: ID!) {
    topicResource(topicId: $topicId, resourceId: $resourceId) {
      topic {
        name
      }
      resource {
        name
        link
      }
      ratingList {
        count
        sum
      }
    }
  }
`;
