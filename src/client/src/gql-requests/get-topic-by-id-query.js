import { gql } from '@apollo/client';

export default gql`
  query GetTopicById($id: ID!) {
    topic(id: $id) {
      id
      name
      resources {
        resource {
          id
          name
          link
        }
        ratings {
          value
        }
      }
    }
  }
`;
