import { gql } from 'graphql-request';

export default gql`
  query ReadOnlyModeEnabledQuery {
    readOnlyModeEnabled
  }
`;
