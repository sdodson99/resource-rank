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
      id
      name
      slug
      alreadyAdded
    }
  }
`;

export default availableTopicResourcesQuery;
