import { gql } from 'graphql-request';

export default gql`
  query GetTopics($search: String) {
    topics(search: $search) {
      id
      name
      slug
    }
  }
`;
