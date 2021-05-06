import { gql } from '@apollo/client';

export default gql`
  query ResourceExists($name: String!) {
    resourceExists(name: $name)
  }
`;
