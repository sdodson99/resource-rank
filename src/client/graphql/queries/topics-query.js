import { gql } from 'graphql-request';

const topicsQuery = gql`
  query GetTopics($search: String) {
    topics(search: $search) {
      id
      name
      slug
    }
  }
`;

export default topicsQuery;
