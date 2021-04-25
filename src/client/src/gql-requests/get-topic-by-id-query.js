import { gql } from '@apollo/client';

export default gql`
  query GetTopicById($id: ID!) {
    topic(id: $id) {
      id
      name
      resources {
        resourceInfo {
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
