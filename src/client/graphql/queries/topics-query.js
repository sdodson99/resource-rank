import { gql } from 'graphql-request';

const topicsQuery = gql`
  query Topics($search: String) {
    topics(search: $search) {
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
