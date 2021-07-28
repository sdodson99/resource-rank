import { gql } from 'graphql-request';

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
        ratingList {
          average
        }
      }
    }
  }
`;