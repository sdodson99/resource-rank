import { gql } from '@apollo/client';

export default gql`
  mutation CreateTopic($name: String!) {
    createTopic(name: $name) {
      id
      name
    }
  }
`;
