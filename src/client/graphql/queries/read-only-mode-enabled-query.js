import { gql } from 'graphql-request';

const readOnlyModeEnabledQuery = gql`
  query ReadOnlyModeEnabled {
    readOnlyModeEnabled
  }
`;

export default readOnlyModeEnabledQuery;
