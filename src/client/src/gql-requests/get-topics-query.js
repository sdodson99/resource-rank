import { gql } from '@apollo/client';

export default gql`
  query GetTopics($search: String) {
    topics(search: $search) {
      id
      name
    }
  }
`;
