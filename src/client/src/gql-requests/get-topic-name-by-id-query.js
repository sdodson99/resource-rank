import { gql } from '@apollo/client';

export default gql`
  query GetTopicNameByID($id: ID!) {
    topic(id: $id) {
      name
    }
  }
`;
