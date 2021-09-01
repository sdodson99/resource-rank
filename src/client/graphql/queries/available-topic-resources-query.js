import { gql } from 'graphql-request';

const availableTopicResourcesQuery = gql`
  query AvailableTopicResources(
    $topicId: ID!
    $search: String
    $offset: Int
    $limit: Int
  ) {
    availableResources(
      topicId: $topicId
      search: $search
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
        alreadyAdded
      }
      totalCount
    }
  }
`;

export default availableTopicResourcesQuery;
