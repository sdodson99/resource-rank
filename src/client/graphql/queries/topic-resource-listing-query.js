import { gql } from 'graphql-request';

const topicResourceListingQuery = gql`
  query TopicResourceListing($topicId: ID!, $resourceSearch: String) {
    topicResourceList(topicId: $topicId, resourceSearch: $resourceSearch) {
      topicResources {
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
    }
  }
`;

export default topicResourceListingQuery;
