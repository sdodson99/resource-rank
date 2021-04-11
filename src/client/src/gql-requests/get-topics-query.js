import { gql } from '@apollo/client';

export default gql`
  query GetTopics {
    topics {
      id
      name
    }
  }
`;
