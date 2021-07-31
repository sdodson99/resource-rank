import { gql } from 'graphql-request';

export default gql`
  mutation CreateTopic($name: String!) {
    createTopic(name: $name) {
      id
      name
      slug
    }
  }
`;
