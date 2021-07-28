import { gql } from 'graphql-request';

export default gql`
  query GetTopicNameByID($id: ID!) {
    topic(id: $id) {
      name
    }
  }
`;
