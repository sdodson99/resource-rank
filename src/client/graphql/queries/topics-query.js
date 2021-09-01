import { gql } from 'graphql-request';

const topicsQuery = gql`
  query Topics($search: String, $offset: Int, $limit: Int) {
    topics(search: $search, offset: $offset, limit: $limit) {
      items {
        id
        name
        slug
        verified
      }
      totalCount
    }
  }
`;

export default topicsQuery;
