import { gql } from 'graphql-request';

const topicResourcesQuery = gql`
  query TopicResources($topicId: ID!, $resourceSearch: String) {
    topicResources(topicId: $topicId, resourceSearch: $resourceSearch) {
      items {
        resource {
          id
          name
          slug
          verified
        }
        ratingList {
          average
        }
      }
      totalCount
    }
  }
`;

export default topicResourcesQuery;
