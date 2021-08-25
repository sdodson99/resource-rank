import { gql } from 'graphql-request';

const topicResourcesQuery = gql`
  query TopicResources(
    $topicId: ID!
    $resourceSearch: String
    $offset: Int
    $limit: Int
  ) {
    topicResources(
      topicId: $topicId
      resourceSearch: $resourceSearch
      offset: $offset
      limit: $limit
    ) {
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
