import { gql } from 'graphql-request';

export default gql`
  query ResourceExists($name: String!) {
    resourceExists(name: $name)
  }
`;
