import { gql } from '@apollo/client';

export default gql`
  query ReadOnlyModeEnabledQuery {
    readOnlyModeEnabled
  }
`;
