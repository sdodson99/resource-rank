import { gql } from '@apollo/client';

export default gql`
  query GetTopicResourceListingQuery($topicId: ID!, $resourceSearch: String) {
    topicResourceList(topicId: $topicId, resourceSearch: $resourceSearch) {
      topicResources {
        resource {
          id
          name
        }
        ratingList {
          average
        }
      }
    }
  }
`;
