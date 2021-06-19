import { gql } from 'graphql-request';

export default gql`
  query GetAvailableResources(
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
      alreadyAdded
    }
  }
`;
