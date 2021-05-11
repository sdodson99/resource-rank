import { gql } from '@apollo/client';

export default gql`
  query GetTopics($name: String) {
    topics(name: $name) {
      id
      name
    }
  }
`;
