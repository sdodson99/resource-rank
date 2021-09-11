import { gql } from 'graphql-request';

const topicResourcesQuery = gql`
  query TopicResources($topicId: ID!, $searchOptions: SearchOptionsInput) {
    topicResources(topicId: $topicId, searchOptions: $searchOptions) {
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
