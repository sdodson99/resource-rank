import { gql } from 'graphql-request';

const featureFlagsQuery = gql`
  query FeatureFlags {
    featureFlags {
      name
      isEnabled
    }
  }
`;

export default featureFlagsQuery;
