import { gql } from 'graphql-request';

const topicsQuery = gql`
  query Topics($search: String) {
    topics(search: $search) {
      id
      name
      slug
    }
  }
`;

export default topicsQuery;
